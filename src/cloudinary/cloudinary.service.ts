import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

const streamifier = require('streamifier');


@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  async uploadFile(filePath: string): Promise<CloudinaryResponse> {
    console.log('vo day khum');
    
    return new Promise<CloudinaryResponse>((resolve, reject) => {
        v2.uploader.upload(filePath, {folder: 'vivaflow-upload'}, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }
}
