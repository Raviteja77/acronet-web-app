import { ErrorHandler, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private messageService: MessageService) {}
    handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong.'
        });
    }
}