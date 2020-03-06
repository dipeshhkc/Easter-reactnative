import NetInfo from '@react-native-community/netinfo';
import { AsyncStorage } from 'react-native';

// services are expected to receive numbers and strings as params
// service middleware function
const ServiceMiddleware = (serviceFunction, storage_name = null) => async (
  ...params
) => {
  if (!storage_name) {
    storage_name = serviceFunction.name;
  }
  
  const status = await NetInfo.fetch();

  if (status.isConnected) {
    const data = await serviceFunction(...params);
    try {
      await AsyncStorage.setItem(
        `${storage_name}-${params.toString()}`,
        JSON.stringify(data)  
      );
    } catch (e) {
      
    }
    return data;
  } else {
    // if no insternet then check for asyncstorage for data
    let local_data= await cacheRequest(storage_name, params);
    return local_data && local_data
  }
  
};

const cacheRequest = async (storage_name, params) => {
  try {
    let data = await AsyncStorage.getItem(
      `${storage_name}-${params.toString()}`
    );
    data = JSON.parse(data);
    return data;
  } catch (e) {
    
  }
};

export default ServiceMiddleware;
