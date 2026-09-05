export interface CreateTeacherPayload {
    name: string
    email: string
    password: string
    phone?: string
    
    subscriptionStatus?: string
    pricePerStudent?: number
}

export type UpdateTeacherPayload = Partial<CreateTeacherPayload>

export interface TeacherLoginPayload {
    email: string
    password: string
}