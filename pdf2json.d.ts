declare module "pdf2json" {
  import { EventEmitter } from "events";

  export default class PDFParser extends EventEmitter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(context?: any, needRawText?: number);
    parseBuffer(buffer: Buffer): void;
    getRawTextContent(): string;
    loadPDF(pdfFilePath: string): void;
  }
}