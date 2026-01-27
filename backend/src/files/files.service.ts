import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as crypto from 'crypto';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

@Injectable()
export class FilesService {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedImageTypes: string[];

  constructor(private configService: ConfigService) {
    // Use absolute path to ensure files are saved in the correct location
    const configuredDir = this.configService.get('UPLOAD_DIR');
    this.uploadDir = configuredDir 
      ? path.resolve(configuredDir) 
      : path.resolve(process.cwd(), 'uploads');
    
    console.log('📁 Upload directory set to:', this.uploadDir);
    
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    const directories = ['properties', 'documents', 'profiles', 'contractors', 'products'];
    
    try {
      await mkdir(this.uploadDir, { recursive: true });
      
      for (const dir of directories) {
        await mkdir(path.join(this.uploadDir, dir), { recursive: true });
      }
    } catch (error) {
      console.error('Error creating upload directories:', error);
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    category: 'properties' | 'documents' | 'profiles' | 'contractors' | 'products',
  ): Promise<string> {
    console.log('📤 Upload attempt:', { 
      filename: file.originalname, 
      mimetype: file.mimetype, 
      size: file.size,
      category 
    });

    // Validate file type
    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedImageTypes.join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File too large. Maximum size: ${this.maxFileSize / (1024 * 1024)}MB`,
      );
    }

    // Generate unique filename
    const fileExt = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
    const filePath = path.join(this.uploadDir, category, fileName);

    console.log('💾 Saving file to:', filePath);

    // Save file
    try {
      await writeFile(filePath, file.buffer);
      console.log('✅ File saved successfully');
      
      // Verify file was created
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log('✅ File verified on disk:', { path: filePath, size: stats.size });
      } else {
        console.error('❌ File not found after write operation!');
        throw new BadRequestException('Failed to save file');
      }
    } catch (error) {
      console.error('❌ Error saving file:', error);
      throw new BadRequestException('Failed to save file: ' + error.message);
    }

    // Return relative URL
    return `/uploads/${category}/${fileName}`;
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    category: 'properties' | 'documents' | 'profiles' | 'contractors' | 'products',
  ): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, category));
    return Promise.all(uploadPromises);
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract path from URL
      const relativePath = imageUrl.replace('/uploads/', '');
      const filePath = path.join(this.uploadDir, relativePath);

      // Check if file exists
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error, just log it
    }
  }

  async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(url => this.deleteImage(url));
    await Promise.all(deletePromises);
  }

  validateImageFile(file: Express.Multer.File): boolean {
    return (
      this.allowedImageTypes.includes(file.mimetype) &&
      file.size <= this.maxFileSize
    );
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
