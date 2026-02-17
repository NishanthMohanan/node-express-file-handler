# Universal File Handler for Node.js Express (TypeScript)

A production-ready, reusable file handler module designed for Node.js Express backend systems. This package provides a scalable, provider-agnostic file upload and management solution supporting Local Storage, AWS S3, and Cloudinary.

This module was designed to be used as a plug-and-play infrastructure component for any Node.js Express backend project.

---

## Purpose

This package solves file handling problems in backend systems including:

• File upload  
• File validation  
• Duplicate detection  
• File deletion  
• Metadata management  
• Storage abstraction  

It can be integrated into any backend project without modifying business logic.

---

## Key Features

Production-ready architecture  
Supports Local, S3, and Cloudinary providers  
Duplicate file detection  
Metadata storage and management  
Strong validation system  
Express middleware integration  
TypeScript support  
Reusable and modular design  
Secure file handling  
Single and multiple file upload support  

---

## Designed for Reusability

This file handler was specifically designed to support any Node.js Express backend project.

Use cases include:

• SaaS platforms  
• Enterprise systems  
• Admin dashboards  
• Profile image uploads  
• Document management systems  
• Multi-tenant applications  

It works as an infrastructure layer independent of business logic.

---

## Installation

Install from GitHub:

npm install github:NishanthMohanan/node-express-file-handler


Or local install:

npm install ../file-handler


---

## API Endpoints

### Upload single file

POST /files/upload

Response:

{
"message": "File uploaded",
"file": {
"id": "...",
"filename": "...",
"path": "...",
"size": ...
}
}


---

### Upload multiple files

POST /files/upload-multiple

---

### Delete file

DELETE /files/delete/:id

---

## Validation System

Built-in validation includes:

File size validation  
File existence validation  
Upload directory validation  
Provider validation  

All validation errors return structured responses.

---

## Metadata Handling

File metadata is stored as structured JSON objects in memory.

Metadata includes:

File ID  
Filename  
Storage path  
Upload directory  
File size  
Upload timestamp  

This design allows easy integration with databases.

---

## Technology Stack

Node.js  
Express.js  
TypeScript  
Multer  
UUID  

---

## Production Design Goals

Reusability  
Scalability  
Security  
Provider abstraction  
Clean architecture  

---

## Integration Example with Backend Codebase

This module was designed to integrate easily with modular backend systems:

import createFileRoutes from "file-handler";

app.use("/api/files", createFileRoutes());


---

## Author

Nishanth M  
