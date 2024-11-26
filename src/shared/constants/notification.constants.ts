import { configService } from "nest-shared";

//User related
export const USER_THEME_UPDATED = "User theme is updated to ";
export const USER_DETAILS_UPDATED = "Profile info has been updated for ";
export const USER_PHOTO_UPDATED = "Profile photo has been updated for ";
export const USER_PASSWORD_RESET = "Password has been reset for ";
export const USER_PERMISSION_MODIFIED = "Permissions have been updated for ";
export const USER_DELETED = "User account has been deleted for ";
export const USER_CREATED = "User account has been created for ";
export const USER_UPDATED = "User account has been updated for ";

//Accounting

export const INVOICE_CANCELLED = "Invoice# {0} has been cancelled by {1}";
export const INVOICE_PAID = "Invoice# {0} has been PAID on {1} by {2} with amount {3}";
export const FEE_PLAN_UPDATED = "Fee Plan updated for student {0} by {1} on {2}";
export const FAMILY_CREDIT_UPDATED = "Wallet updated for parent {0} on {1}";
export const PRODUCT_CATEGORY_ADDED = "New Product Category - {0} has been added by {1}";
export const PRODUCT_CATEGORY_UPDATED = "Product Category - {0} has been updated by {1}";
export const POINT_OF_SALE = "{0} items have been sold by {1} with Invoice # {2}";

export const EXPENSE_TYPE_UPDATED = "Expense Type - {0} has been updated by {1}";
export const EXPENSE_TYPE_ADDED = "New Expense Type - {0} has been added by {1}";


export const EXPENSE_UPDATED = "Expense - {0} has been updated by {1}";
export const EXPENSE_ADDED = "New Expense - {0} has been added by {1}";
export const EXPENSE_DELETED = "Expense - {0} has been deleted by {1}";


//Role Permission messages
export const ROLE_UPDATES = " - Role/Access been modified. Contact Support if you didn't make this change or need more details.";
export const ROLE_DELETED = " - Role/Access been deleted. Contact Support if you didn't make this change or need more details.";

//Leaves
export const LEAVE_REQUEST_APP_REJ = "Leave Request with ID {0} has been {1}, Reason: {2}";
export const LEAVE_REQUESTED = "A new leave request with ID {0} has been submitted with reason: {1}";

//Loan
export const LOAN_REQUEST_STATUS = "Loan Request with ID {0} has been {1}, Reason: {2}";
export const LOAN_REQUEST_CREATED = "A new loan request has been created. Please process (approve/reject) the same";


//Notifications
export const UPDATE_MASTER_NOTIFICATION = "Notification with ID {0} has been updated";

export function buildMessage(template: string, ...values: string[]): string {
    let result = template;
    for (let i = 0; i < values.length; i++) {
        result = result.replace(`{${i}}`, values[i]);
    }
    return result;
}