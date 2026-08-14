const fs = require('fs');
const mj = JSON.parse(fs.readFileSync('menu.json','utf8'));
const ih = fs.readFileSync('index.html','utf8');
const m = ih.match(/<script id="menu-json"[\s\S]*?<\/script>/);
if(!m) { console.error('embedded not found'); process.exit(2); }
const js = m[0].replace(/^[\s\S]*?<script[\s\S]*?>/, '').replace(/<\/script>[\s\S]*$/, '');
const ej = JSON.parse(js);
const invalid = arr => arr.filter(i=>!['veg','nonveg','other'].includes(i.type));
console.log('menu.json items:', mj.items.length);
console.log('embedded items:', ej.items.length);
console.log('menu.json invalid types count:', invalid(mj.items).length);
console.log('embedded invalid types count:', invalid(ej.items).length);
const countTypes = arr => arr.reduce((a,i)=>{a[i.type]=(a[i.type]||0)+1;return a;},{})
console.log('menu.json type counts:', JSON.stringify(countTypes(mj.items)));
console.log('embedded type counts:', JSON.stringify(countTypes(ej.items)));
const diff = mj.items.filter((it,idx)=>it.name !== ej.items[idx]?.name || it.price !== ej.items[idx]?.price || it.type !== ej.items[idx]?.type);
console.log('items differing between menu.json and embedded (count):', diff.length);
if(diff.length>0){console.log(diff.slice(0,10));}
