/** Bounded interaction repairs applied to the original bundle before localization. */
export function enhance(source) {
  const replaceOnce = (text, before, after, label) => {
    const first = text.indexOf(before);
    if (first < 0 || text.indexOf(before, first + before.length) >= 0) {
      throw new Error(`Expected one match for ${label}`);
    }
    return text.slice(0, first) + after + text.slice(first + before.length);
  };

  source = replaceOnce(
    source,
    's=t=>{t&&t!==`calendar`&&t!==`coupangeats`&&t!==`photos`&&t!==`goodnotes`&&e(t)}',
    's=t=>{t&&e(t)}',
    'home app activation'
  );

  const gallery = `function CnPhotos(){
    let {closeApp:close}=E(),[selected,setSelected]=(0,_.useState)(null);
    const pictures=["/gn1.jpg","/gn2.JPG","/gn3.png","/gn4.JPG","/gn5.JPG","/gn6.JPG","/rn1.JPG","/rn2.JPG","/rn3.JPG","/rn4.JPG","/rn5.JPG","/mov1.png","/mov2.png","/mov3.png","/mov4.png","/kong.JPG","/arno-avatar.png"];
    const buttonStyle={border:0,background:"transparent",color:"#007aff",fontSize:15,padding:"8px 4px",cursor:"pointer"};
    const move=step=>setSelected(index=>(index+step+pictures.length)%pictures.length);
    return (0,M.jsxs)("section",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0,height:"100%",background:"#fff",color:"#171717",position:"relative",fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif"},children:[
      (0,M.jsxs)("header",{style:{padding:"48px 18px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,borderBottom:"1px solid #eee"},children:[
        (0,M.jsx)("button",{onClick:close,"aria-label":"返回手机桌面",style:buttonStyle,children:"‹ 桌面"}),
        (0,M.jsx)("h1",{style:{fontSize:19,fontWeight:700,margin:0},children:"照片"}),
        (0,M.jsx)("span",{style:{fontSize:12,color:"#888"},children:pictures.length+" 张"})
      ]}),
      (0,M.jsxs)("div",{style:{flex:1,minHeight:0,overflowY:"auto",paddingBottom:35},children:[
        (0,M.jsx)("h2",{style:{fontSize:24,fontWeight:700,margin:"18px 16px"},children:"所有照片"}),
        (0,M.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:2},children:pictures.map((path,index)=>(0,M.jsx)("button",{onClick:()=>setSelected(index),"aria-label":"查看照片 "+(index+1),style:{display:"block",border:0,padding:0,background:"#eee",aspectRatio:"1",cursor:"pointer",overflow:"hidden"},children:(0,M.jsx)("img",{src:path,alt:"照片 "+(index+1),loading:"lazy",style:{display:"block",width:"100%",height:"100%",objectFit:"cover"}})},path))}),
        (0,M.jsx)("p",{style:{fontSize:12,color:"#888",textAlign:"center",margin:"24px 12px"},children:pictures.length+" 张照片"})
      ]}),
      selected!==null&&(0,M.jsxs)("div",{role:"dialog","aria-modal":true,"aria-label":"照片查看器",onKeyDown:event=>{if(event.key==="Escape")setSelected(null);if(event.key==="ArrowLeft")move(-1);if(event.key==="ArrowRight")move(1)},style:{position:"absolute",inset:0,zIndex:50,background:"#080808",display:"flex",flexDirection:"column",color:"white"},children:[
        (0,M.jsxs)("div",{style:{padding:"48px 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
          (0,M.jsx)("button",{autoFocus:true,onClick:()=>setSelected(null),"aria-label":"返回所有照片",style:buttonStyle,children:"‹ 所有照片"}),
          (0,M.jsx)("span",{style:{fontSize:13,color:"#ddd"},children:(selected+1)+" / "+pictures.length})
        ]}),
        (0,M.jsx)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",flex:1,minHeight:0},children:(0,M.jsx)("img",{src:pictures[selected],alt:"照片 "+(selected+1),style:{display:"block",maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}})}),
        (0,M.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",padding:"16px 24px 36px"},children:[
          (0,M.jsx)("button",{onClick:()=>move(-1),"aria-label":"上一张照片",style:buttonStyle,children:"‹ 上一张"}),
          (0,M.jsx)("button",{onClick:()=>move(1),"aria-label":"下一张照片",style:buttonStyle,children:"下一张 ›"})
        ]})
      ]})
    ]})
  }`;
  source = replaceOnce(source, 'function Vh(){let{isLocked:', gallery + 'function Vh(){let{isLocked:', 'photos component insertion');
  source = replaceOnce(source, 'n===`notes`&&(0,M.jsx)(Nm,{})', 'n===`notes`&&(0,M.jsx)(Nm,{}),n===`photos`&&(0,M.jsx)(CnPhotos,{})', 'photos route');

  const kreamStart = source.indexOf('function Rh(){let{closeApp:e}=E()');
  const kreamEnd = source.indexOf('var zh=[', kreamStart);
  if (kreamStart < 0 || kreamEnd < kreamStart) throw new Error('KREAM component boundary missing');
  let kream = source.slice(kreamStart, kreamEnd);
  kream = replaceOnce(kream, '[a,o]=(0,_.useState)(Lh),s=', '[a,o]=(0,_.useState)(Lh),[cnShowAll,cnSetShowAll]=(0,_.useState)(!1),s=', 'KREAM more state');
  kream = replaceOnce(kream, 'l=a.slice(0,4)', 'l=a.filter(item=>r===`전체`||item.category===r).slice(0,cnShowAll?Infinity:4)', 'KREAM category filter');
  kream = replaceOnce(kream, 'onClick:()=>i(e),className:', 'onClick:()=>{i(e);cnSetShowAll(!1)},className:', 'KREAM category selection');
  kream = replaceOnce(kream, 'onClick:()=>{},className:`w-full py-2.5 border', 'onClick:()=>cnSetShowAll(value=>!value),"aria-label":cnShowAll?"收起商品":"查看更多商品",className:`w-full py-2.5 border', 'KREAM more action');
  kream = replaceOnce(kream, 'children:`더보기`', 'children:cnShowAll?"收起":"查看更多"', 'KREAM more label');
  kream = replaceOnce(kream,
    '(0,M.jsxs)(`button`,{className:`flex flex-col items-center gap-0.5 cursor-pointer transition ${t===`style`?',
    '(0,M.jsxs)(`button`,{onClick:()=>n(`style`),"aria-label":"穿搭",className:`flex flex-col items-center gap-0.5 cursor-pointer transition ${t===`style`?',
    'KREAM style navigation');
  kream = replaceOnce(kream,
    '(0,M.jsx)(`div`,{className:`grid grid-cols-2 gap-3`,children:l.map(',
    'l.length===0&&(0,M.jsx)("p",{style:{textAlign:"center",padding:"28px 8px",fontSize:13,color:"#888"},children:"本分类暂无商品"}),(0,M.jsx)(`div`,{className:`grid grid-cols-2 gap-3`,children:l.map(',
    'KREAM empty category');
  source = source.slice(0, kreamStart) + kream + source.slice(kreamEnd);

  source = replaceOnce(source,
    'className:`text-xs font-bold text-stone-400 px-1`,children:`ㄱ`',
    'className:`text-xs font-bold text-stone-400 px-1`,children:"联系人"',
    'contacts group title');
  source = replaceOnce(source,
    'children:[e,`월`]',
    'children:[e,"月"]',
    'calendar month unit distinct from Monday');
  return source;
}
