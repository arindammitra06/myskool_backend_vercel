export type NotificationModel = {
                current_date?:string;
                student_name?:string;
                parent_name?:string;
                parent_phone?:string;
                roll_no?:string;
                student_id_card?:string;
                student_fee?:string;
                reminder_number?:string;
                student_amount_paid?:string;
                student_discount?:string;
                student_late_fees?:string;
                student_fee_received_by?:string;
                student_leave_start?:string;
                student_leave_end?:string;
                student_leave_status?:string;
                student_leave_approved_by?:string;
                institute_name?:string;
                institute_campus?:string;
                class_name?:string;
                section_name?:string;
                session?:string;
                exam_name?:string;
                exam_percentage?:string;
                staff_name?:string;
                staff_designation?:string;
                salary_month?:string;
                staff_payment_total?:string;
                staff_present_days?:string;
                staff_absent_days?:string;
                diary?:string;
                selected_day?:string;
                user_name?:string;
                campusId : number;
                loggedInUserId: number;
                studentOrTeacherId?: number;
                classId?:number;
                sectionId?: number;
                extra_content?: string;
                admission_status?:string;
                approval_status?:string;
}

export type SendToAndFrom = {
    email?:string;
    name?:string;
}

export type EmailNotificationJson = {
    sender?:SendToAndFrom;
    to?:SendToAndFrom[];
    subject: string;
    htmlContent:string;
}