import { ErrorHandler, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private messageService: MessageService) {}
    handleError(error: any): void {
        console.log(error);
        
        alert(error.error)
    }
}