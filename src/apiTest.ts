import {request} from './utils';

const getReports = async () => {
  return await request.get(
    '/myorg/reports',
  );
};

export const apiTest = async () => {
  const response = await getReports();
  console.log(response.data);
};
