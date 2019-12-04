import axios from 'axios';


const instance = axios.create({
  timeout: 30000,
});

const request = async (opt, secure) => {
  const store = localStorage['persist:root'] ?
    JSON.parse(localStorage['persist:root']) : {};
  let {token} = store;
  token = token.slice(1, -1);
  if (secure) {
    if (opt.headers) {
      opt.headers['Authorization'] = `Bearer ${token}`;
    } else {
      opt.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
  }
  opt.url = `${process.env.API_URL}${opt.url}`;

  return await instance.request(opt);
};

export default request;
