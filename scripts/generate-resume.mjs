import { chromium } from "playwright";
import fs from "node:fs";

const font = (name) =>
  `data:font/ttf;base64,${fs.readFileSync(`public/fonts/${name}`).toString("base64")}`;

const content = `
<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Space Grotesk';src:url(${font("space-grotesk-regular.ttf")}) format('truetype');font-weight:400}
@font-face{font-family:'Space Grotesk';src:url(${font("space-grotesk-medium.ttf")}) format('truetype');font-weight:500 700}
@font-face{font-family:'IBM Plex Mono';src:url(${font("ibm-plex-mono.ttf")}) format('truetype');font-weight:400}
@page{size:Letter;margin:0}
*{box-sizing:border-box}html,body{margin:0;padding:0}body{font-family:'Space Grotesk',sans-serif;color:#2e231e;background:#f6efe3;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:8.5in;height:11in;padding:.55in .62in .46in;background:#f7f0e5;position:relative;overflow:hidden}
.top-rule{height:4px;background:#2e231e;display:flex;margin-bottom:18px}.top-rule:after{content:'';display:block;width:28%;background:#ff6b2b;margin-left:auto}
.top{display:flex;align-items:flex-start;justify-content:space-between;gap:30px}
h1{font-size:39px;line-height:1;letter-spacing:-2px;font-weight:500;margin:0 0 8px}.role{font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1.5px;text-transform:uppercase;color:#654b3e}
.contact{text-align:right;font-family:'IBM Plex Mono',monospace;font-size:8px;line-height:1.8;color:#60493f;letter-spacing:.2px}
.summary{font-size:11.5px;line-height:1.6;color:#594236;max-width:6.8in;margin:17px 0 19px}
.layout{display:grid;grid-template-columns:1fr 2.03in;gap:27px}.main{border-top:1.5px solid #a99890;padding-top:15px}.side{border-top:1.5px solid #a99890;padding-top:15px}
h2{font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:400;letter-spacing:1.5px;color:#7a3a1c;margin:0 0 9px;text-transform:uppercase}
.entry{margin-bottom:12px;break-inside:avoid}.entry-head{display:flex;justify-content:space-between;gap:10px;align-items:baseline}.entry h3{font-size:13px;font-weight:500;letter-spacing:-.15px;margin:0}.entry .period{font-family:'IBM Plex Mono',monospace;font-size:6.8px;color:#836e64;letter-spacing:.4px;white-space:nowrap}.entry-sub{display:flex;justify-content:space-between;gap:12px;font-size:9px;color:#6d5144;margin:2px 0 4px}.entry p{font-size:9px;line-height:1.45;color:#5d453a;margin:0 0 3px}
ul{margin:3px 0 0;padding-left:12px;color:#7a3a1c}li{font-size:8.7px;line-height:1.45;margin-bottom:1.5px}
.edu{margin-bottom:15px}.edu h3{font-size:13px;margin:0 0 3px;font-weight:500}.edu p{font-size:9px;line-height:1.5;color:#7c4222;margin:2px 0}
.focus{margin-bottom:13px}.focus strong{display:block;font-size:9px;font-weight:500;margin-bottom:2px;color:#3b2c25}.focus p{font-size:8.8px;line-height:1.45;color:#7c4222;margin:0}
.side-note{font-size:8.8px;line-height:1.5;color:#7c4222;margin:0}
.foot{position:absolute;bottom:.29in;left:.62in;right:.62in;border-top:1px solid #ccbdb7;padding-top:8px;display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:7px;color:#89766d;letter-spacing:.7px}
</style></head><body><div class="page"><div class="top-rule"></div>
<div class="top"><div><h1>Dylan Kwok</h1><div class="role">Aerospace Engineering · First-Year Student</div></div><div class="contact">hello@dylankwok.space<br>san francisco, ca<br>dylankwok.space</div></div>
<p class="summary">First-year aerospace engineering student working across competitive rocketry, H2GP competition engineering, CubeSat structures, and student maker organizations.</p>
<div class="layout"><main class="main">
<h2>Education</h2><div class="edu"><h3>Aerospace Engineering</h3><p>First-year undergraduate · San Francisco, California</p></div>
<h2>Experience &amp; Organizations</h2>
<div class="entry"><div class="entry-head"><h3>Founder</h3><span class="period">CURRENT</span></div><div class="entry-sub"><span>Untitled Rocketry</span><span>Community / Competition</span></div><ul><li>Founded a rocketry community organization in Fremont, California.</li><li>Untitled Rocketry competes in the American Rocketry Challenge.</li></ul></div>
<div class="entry"><div class="entry-head"><h3>Lead Engineer</h3><span class="period">CURRENT</span></div><div class="entry-sub"><span>Irvington Driving Force</span><span>H2GP Competition</span></div><ul><li>Lead Engineer for Irvington Driving Force, a team competing in H2GP.</li></ul></div>
<div class="entry"><div class="entry-head"><h3>Structures</h3><span class="period">CURRENT</span></div><div class="entry-sub"><span>MakerCubed CubeSat Project</span><span>Space Hardware</span></div><ul><li>Work on structures for the MakerCubed CubeSat Project.</li></ul></div>
<div class="entry"><div class="entry-head"><h3>Co-founder</h3><span class="period">CURRENT</span></div><div class="entry-sub"><span>Fremont Student Makers</span><span>501(c)(3) Nonprofit</span></div><ul><li>Co-founded Fremont Student Makers, a 501(c)(3) nonprofit organization.</li></ul></div>
<div class="entry"><div class="entry-head"><h3>Director of Aerospace &amp; Treasurer</h3><span class="period">CURRENT</span></div><div class="entry-sub"><span>Irvington Maker Club</span><span>Leadership</span></div><ul><li>Serve as Director of Aerospace and Treasurer for the Irvington Maker Club.</li></ul></div>
</main><aside class="side">
<h2>Areas of Practice</h2>
<div class="focus"><strong>Competitive rocketry</strong><p>Untitled Rocketry · American Rocketry Challenge</p></div>
<div class="focus"><strong>Competition engineering</strong><p>Irvington Driving Force · H2GP</p></div>
<div class="focus"><strong>Space hardware</strong><p>MakerCubed CubeSat structures</p></div>
<div class="focus"><strong>Student organizations</strong><p>Fremont Student Makers · Irvington Maker Club</p></div>
<h2>Focus</h2><p class="side-note">Competitive rocketry, spacecraft structures, and building communities where students can make things together.</p>
</aside></div>
<div class="foot"><span>DYLAN KWOK / RÉSUMÉ</span><span>CURRENT SNAPSHOT</span></div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(content, { waitUntil: "load" });
await page.pdf({
  path: "public/documents/dylan-kwok-resume.pdf",
  format: "Letter",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});
await browser.close();
console.log("Wrote Dylan Kwok resume PDF");
