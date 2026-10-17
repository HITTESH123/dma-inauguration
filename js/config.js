// ─────────────────────────────────────────────────────────────
//  Event configuration — edit this file to update the site.
//  Anything marked TODO is a placeholder to confirm before launch.
// ─────────────────────────────────────────────────────────────
window.EVENT = {
  company: "DMA Technologies",
  legalName: "DMA Technologies Private Limited",
  website: "https://dmatech.in/",
  phone: "+91 9600662047",

  // Date of the ceremony (YYYY-MM-DD, Indian Standard Time)
  date: "2026-10-19",
  dayLabel: "Monday",

  // 24h "HH:MM". If set to null, the countdown runs to the start of the day and
  // "Add to calendar" creates an all-day event. endTime defaults to start + 3h.
  startTime: "10:00",
  endTime: null,
  timeLabel: "10:00 AM",

  venue: "Plot No.177, Radiance, OMR, Thaiyur, Chengalpattu, Tamil Nadu",
  mapsQuery: "Radiance, Plot No.177, OMR, Thaiyur, Chengalpattu, Tamil Nadu",

  // Background music: starts when the doors open and loops.
  // If the file is missing, the site stays silent and hides the music button.
  musicFile: "assets/audio/theme.mp3",
  // If the track's license requires a credit, fill this in (it shows in the footer):
  // { title: "", author: "", url: "", source: "", license: "", licenseUrl: "", note: "" }
  musicCredit: null,

  // TODO: sample order of ceremonies — edit or replace with the real programme.
  programme: [
    { time: "", title: "Ganapathi Pooja", text: "Invoking blessings for an auspicious beginning." },
    { time: "", title: "Lighting of the Kuthuvilakku", text: "The traditional lamp is lit by our leadership and guests." },
    { time: "", title: "Ribbon Cutting & Office Opening", text: "Formally opening the doors of our new home." },
    { time: "", title: "Address by Leadership", text: "A few words on the journey so far and the road ahead." },
    { time: "", title: "Prasadam & Lunch", text: "Sharing the blessings together." }
  ]
};
