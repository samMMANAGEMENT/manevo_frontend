export interface PendingBillingItem {
    id: number;
    type: 'sale' | 'service';
    date: string;
    total: number;
    description: string;
    details: string;
}

export interface InvoiceItem {
    id: number;
    invoice_id: number;
    description: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Invoice {
    id: number;
    number: string;
    prefix: string;
    cufe: string;
    status: 'draft' | 'sent' | 'error' | 'canceled';
    customer_name: string;
    customer_identification: string;
    customer_email: string;
    subtotal: number;
    total: number;
    pdf_url: string;
    xml_url: string;
    created_at: string;
    items: InvoiceItem[];
}
