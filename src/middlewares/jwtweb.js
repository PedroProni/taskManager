export default async (reqPromise, res, next, jwt) => {
  try {
    const req = await reqPromise;
    console.log('Request:', req);
    console.log('Response:', res);
    console.log('JWT:', jwt);
    next();
  } catch (error) {
    console.error('Error resolving req promise:', error);
    res.status(500).send('Internal Server Error');
  }
};
