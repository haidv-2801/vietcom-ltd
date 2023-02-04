import axiosClient from './axiosClient';
import { objectToQueryParams } from '../constants/commonFunction';

const baseApi = {
  get: async (success, error, beforeSend, endPoint, params, config) => {
    if (beforeSend) beforeSend();
    try {
      let res = await axiosClient.get(
        endPoint + objectToQueryParams(params),
        config
      );
      if (success) success(res);
      return res;
    } catch (e) {
      if (error) {
        error(e);
      }
      throw e;
    }
  },
  post: async (success, error, beforeSend, endPoint, body, params, config) => {
    if (beforeSend) beforeSend();
    try {
      let res = await axiosClient.post(
        endPoint + objectToQueryParams(params),
        body,
        config
      );
      if (success) success(res);
      return res;
    } catch (e) {
      if (error) {
        error(e);
      }
      throw e;
    }
  },
  put: async (success, error, beforeSend, endPoint, body, params, config) => {
    if (beforeSend) beforeSend();
    try {
      let res = await axiosClient.put(
        endPoint + objectToQueryParams(params),
        body,
        config
      );
      if (success) success(res);
      return res;
    } catch (e) {
      if (error) {
        error(e);
      }
      throw e;
    }
  },
  delete: async (
    success,
    error,
    beforeSend,
    endPoint,
    body,
    params,
    config
  ) => {
    if (beforeSend) beforeSend();
    try {
      let res = await axiosClient.delete(
        endPoint + objectToQueryParams(params),
        {
          ...config,
          data: body,
        }
      );
      if (success) success(res);
      return res;
    } catch (e) {
      if (error) {
        error(e);
      }
      throw e;
    }
  },
};

export default baseApi;
