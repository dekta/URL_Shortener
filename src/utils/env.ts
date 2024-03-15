import { config } from 'dotenv';

config();

const getVar = (name) => {
  const variable = process.env[name];
  if (!variable) throw new Error(`Unable to locate env. variable: ${name}`);
  return variable;
};

const Env = {
  jwt: {
    crypt_salt: getVar('CRYPT_SALT'),
    expiry: getVar('EXPIRATION'),
  },
  database: {
    mongo_url: getVar('DATABASE_URL'),
  },
  baseurl:{
    url :getVar('BASE_URL')
  },
  redis:{
    redis_server: getVar('REDIS_SERVER')

  }
 
};
export default Env;
