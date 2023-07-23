import axios from 'axios';
import Cookies from 'js-cookie';
import qs from 'qs';
import { enqueueSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
const http = axios.create({
    baseURL: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
    timeout: 30000,
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            encode: false
        });
    }
});

http.interceptors.request.use(
    (config) => {
        if (Cookies.get('accessToken') !== null && Cookies.get('accessToken') !== undefined) {
            config.headers.Authorization = 'Bearer ' + Cookies.get('accessToken');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            !!error.response &&
            !!error.response.data.error &&
            !!error.response.data.error.message &&
            error.response.data.error.details
        ) {
            enqueueSnackbar(
                <>
                    <div>
                        <div>Lỗi</div>
                        <span>
                            {error.response.data.error.message}:{error.response.data.error.details}
                        </span>
                    </div>
                </>,
                {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 3000
                }
            );
        } else if (
            !!error.response &&
            !!error.response.data.error &&
            !!error.response.data.error.message
        ) {
            error.response.status == 401
                ? enqueueSnackbar(
                      <>
                          <div>
                              <div>Lỗi</div>
                              <span>Phiên làm việc đã hết hiệu lực vui lòng đăng nhập lại!</span>
                          </div>
                      </>,
                      {
                          variant: 'error',
                          anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'center'
                          },
                          action: (key) => (
                              <>
                                  <IconButton
                                      onClick={() => {
                                          window.location.href = '/login';
                                      }}>
                                      <CloseOutlinedIcon sx={{ color: '#FFFFFF' }} />
                                  </IconButton>
                              </>
                          )
                      }
                  )
                : enqueueSnackbar(
                      <>
                          <div>
                              <div>Lỗi</div>
                              <span>
                                  {error.response.data.error.message}:
                                  {error.response.data.error.details}
                              </span>
                          </div>
                      </>,
                      {
                          variant: 'error',
                          anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'center'
                          },
                          autoHideDuration: 3000
                      }
                  );
        } else if (!error.response) {
            // Hiển thị thông báo lỗi sử dụng toastify
            (
                <>
                    <div>
                        <div>Error</div>
                        <span>UnknownError</span>
                    </div>
                </>
            ),
                {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 3000
                };
        }
        return Promise.reject(error);
    }
);

export default http;
