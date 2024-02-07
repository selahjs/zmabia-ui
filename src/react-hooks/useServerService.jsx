import React, { useMemo } from 'react';
import getService from '../react-components/utils/angular-utils';

const useServerService = (serviceName) => {
    return useMemo(() => getService(serviceName), []);
}

export default useServerService;
