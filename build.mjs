import { parse } from 'acorn';
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { enhance } from './patches.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = file => readFile(path.join(root, file), 'utf8');
const translations = Object.assign({}, ...await Promise.all(
  ['auto', 'part-1', 'part-2', 'part-3'].map(async name => JSON.parse(await read(`translations/${name}.json`)))
), {
  'Arno': '张家豪',
  'ko-KR': 'zh-CN',
  'my_phone_unlocked_state': 'hao_phone_cn_v1',
  'See original': '查看原文',
  'See translation': '查看译文',
  '― WeChat Translate': '― 微信翻译',
  'Moments (朋友圈)': '朋友圈',
  'WeChat': '微信',
  'WeChat (1)': '微信 (1)',
  'WeChat ID: dryxccc1234': '微信号：dryxccc1234',
  'Online': '在线', 'Search': '搜索', 'Chats': '聊天',
  'Contacts': '通讯录', 'Discover': '发现', 'Me': '我',
  'mobile': '手机', 'Help': '帮助', 'EATS OPEN': '外卖营业中',
  'search or enter website name': '搜索或输入网址',
  'Log In': '登录',
  'Choose login methods': '选择登录方式',
  'Other Login Methods >': '其他登录方式 ›',
  'Bind new phone number (+82)': '绑定新手机号（+82）',
  'I have read and agreed to the following policies: ': '我已阅读并同意以下条款：',
  'Terms, Privacy Policy, Protection Rules for Children/Teenagers': '服务条款、隐私政策、未成年人保护规则',
  'HOME': '首页', 'STYLE': '穿搭', 'SAVED': '收藏', 'MY': '我的',
  'JUST DROPPED': '本周新品', 'RELEASE': '新品发售', 'FAST': '快速发货',
  'Good vibes only ': '只留好心情 ',
  'do u know Arno??': '你认识张家豪吗？',
  'bro 🤣🤣': '哥 🤣🤣',
  'IAB Studio Knit Muffler Black White': 'IAB Studio 黑白针织围巾',
  'AMI Blue Denim Cotton Ami De Coeur Shirt Indigo': 'AMI 蓝色爱心标牛仔衬衫',
  "Arc'teryx Squamish Hoody Black": '始祖鸟 Squamish 黑色连帽风衣',
  '(W) On Running Cloud 6 Black': 'On 昂跑 Cloud 6 黑色女款跑鞋',
  'Acne Studios Narrow Wool Fringe Muffler Light Grey Melange': 'Acne Studios 浅灰羊毛流苏围巾',
  'Polo Ralph Lauren Slub Denim Western Shirt Blue - 26FW': 'Polo Ralph Lauren 蓝色西部牛仔衬衫 · 26 秋冬',
  '진첸요우': 'Jin Chenyou'
});

const source = enhance(await read('assets/source.js'));
const ast = parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
const replacements = [];
const untranslated = new Set();
let translatedCount = 0;
const translate = value => {
  if (Object.hasOwn(translations, value)) { translatedCount++; return translations[value]; }
  if (value.startsWith('/') && /\.(png|jpe?g|webp|mp[34]|gif|svg|wav|ogg)$/i.test(value)) {
    if (value === '/kong.jpg') return './assets/media/arno-avatar.png';
    if (value === '/gn2.jpg') return './assets/media/unavailable.svg';
    return './assets/media' + value;
  }
  if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/u.test(value)) untranslated.add(value);
  return value;
};
const escapeTemplate = value => value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'Literal' && typeof node.value === 'string') {
    const value = translate(node.value);
    if (value !== node.value) replacements.push({ start: node.start, end: node.end, text: JSON.stringify(value) });
  }
  if (node.type === 'TemplateElement') {
    const value = translate(node.value.cooked);
    if (value !== node.value.cooked) replacements.push({ start: node.start, end: node.end, text: escapeTemplate(value) });
  }
  if (node.type === 'Identifier' && /[가-힣]/u.test(node.name)) {
    const value = translate(node.name);
    if (value !== node.name) replacements.push({ start: node.start, end: node.end, text: JSON.stringify(value) });
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') walk(value);
  }
}
walk(ast);
if (untranslated.size) throw new Error('Untranslated Korean: ' + JSON.stringify([...untranslated]));
let localized = source;
for (const item of replacements.sort((a, b) => b.start - a.start)) {
  localized = localized.slice(0, item.start) + item.text + localized.slice(item.end);
}
// Keep a small, explicit bridge for the companion guide; it does not skip story gates.
localized += '\nwindow.HaoPhone={home:()=>E.getState().closeApp()};\n';
parse(localized, { ecmaVersion: 'latest', sourceType: 'module' });

await rm(path.join(root, 'dist'), { recursive: true, force: true });
await mkdir(path.join(root, 'dist/assets'), { recursive: true });
await cp(path.join(root, 'assets/media'), path.join(root, 'dist/assets/media'), { recursive: true });
await cp(path.join(root, 'assets/style.css'), path.join(root, 'dist/assets/style.css'));
await writeFile(path.join(root, 'dist/assets/app.js'), localized);
for (const file of ['index.html', 'guide.css', 'guide.js']) {
  await cp(path.join(root, file), path.join(root, 'dist', file));
}
console.log(JSON.stringify({ translatedStrings: translatedCount, replacements: replacements.length, output: 'dist', koreanRemaining: 0 }));
