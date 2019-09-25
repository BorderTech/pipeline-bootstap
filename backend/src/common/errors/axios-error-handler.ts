import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

export const handleAxiosError = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response);
    throw new HttpException(error.response.data, error.response.status);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
    throw new InternalServerErrorException(error);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log(
      'Axios - something happened in setting up the request that triggered an Error',
      error.message,
    );
    throw new InternalServerErrorException(error);
  }
  console.log(error.config);
};
