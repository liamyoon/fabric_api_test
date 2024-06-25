import {request, saveFile} from './utils';
import {InternalAxiosRequestConfig} from 'axios';

const groupId = process.env.GROUP_ID as string;

const getGroups = async () => {
  return await request.get(`myorg/groups`);
};

const getReports = async () => {
  return await request.get(
    '/myorg/reports',
  );
};

const getReportsInGroup = async (groupId: string) => {
  return await request.get(
    `/myorg/groups/${groupId}/reports`,
  );
};

const getReport = async (reportId: string) => {
  return await request.get(
    `/myorg/reports/${reportId}`,
  );
};

const exportReport = async (reportId: string) => {
  return await request.post(
    `/myorg/reports/${reportId}/Export`,
  );
};

const exportToReport = async (reportId: string) => {
  return await request.post(
    `/myorg/reports/${reportId}/ExportTo`,
    {
      format: 'PDF'
    },
  );
};

const getExport = async (reportId: string, exportId: string) => {
  return await request.get(
    `/myorg/reports/${reportId}/exports/${exportId}`,
  );
};

const getExportFile = async (reportId: string, exportId: string) => {
  return await request.get(
    `/myorg/reports/${reportId}/exports/${exportId}/file`,
    {
      responseType: 'stream'
    } as any,
  );
};

const getPages = async (reportId: string) => {
  return await request.get(
    `/myorg/reports/${reportId}/pages`,
  );
};

const getPage = async (reportId: string, pageName: string) => {
  return await request.get(
    `/myorg/reports/${reportId}/pages/${pageName}`,
  );
};

const getDatasources = async (reportId: string) => {
  return await request.get(
    `/myorg/reports/${reportId}/datasources`,
  );
};

const getDatasourcesInGroup = async (groupId: string, reportId: string) => {
  return await request.get(
    `/myorg/groups/${groupId}/reports/${reportId}/datasources`,
  );
}

const rebindReport = async (reportId: string, datasetId: string) => {
  return await request.post(
    `/myorg/reports/${reportId}/Rebind`,
    {
      datasetId,
    }
  );
};

const exportId = 'Mi9CbG9iSWRWMi04NGVkY2JlNC0yY2MzLTQ5MzItYjM5Yi02MTY4MDZlMTg0NjJwNzN2dlJiOW9pMkNUWEFDYXhXQjBqQWphVmFob3JvdUVHaGpOQmRxRWdvPS4=';
export const apiTest = async () => {
  const reportsResponse = await getReports();
  const [report] = reportsResponse.data.value;
  const reportResponse = await getReport(report.id);
  const { id } = reportResponse.data;
  // const response = await exportToReport(id);
  const rsp = await getExportFile(id, exportId);
  await saveFile(rsp);
  // const pagesResponse = await getPages(id);
  // const [page] = pagesResponse.data.value;
  // const pageResponse = await getPage(id, page.name);
  // console.log('check');
  // const datasourcesResponse = await getDatasources(id);
  // console.log(datasourcesResponse.data);
  // const rebind = await rebindReport(id, '111');
};
