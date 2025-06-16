import { jsPDF } from "jspdf"
var font = 'undefined';
var callAddFont = function () {
this.addFileToVFS('/Users/dylanpark/Desktop/tdh-cal/public/fonts/NotoSansKR-Regular.ttf-normal.ttf', font);
this.addFont('/Users/dylanpark/Desktop/tdh-cal/public/fonts/NotoSansKR-Regular.ttf-normal.ttf', '/Users/dylanpark/Desktop/tdh-cal/public/fonts/NotoSansKR-Regular.ttf', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
