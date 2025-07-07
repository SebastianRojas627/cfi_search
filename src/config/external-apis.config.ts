export default () => ({
  segip: {
    url: process.env.SEGIP_URL,
    token: process.env.SEGIP_TOKEN,
  },
  itv: {
    url: process.env.ITV_URL,
    token: process.env.ITV_TOKEN,
  },
  sinarap: {
    url: process.env.SINARAP_URL,
  },
});
