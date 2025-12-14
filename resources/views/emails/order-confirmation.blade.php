<x-mail::message>
# Order Confirmation

Dear {{ $order->customer_name }},

Thank you for your order! Your order has been received and is being processed.

## Order Details

**Order Number:** {{ $order->order_number }}  
**Order Date:** {{ $order->created_at->format('F j, Y, g:i a') }}  
**Payment Method:** {{ ucfirst($order->payment_method) }}  
**Payment Status:** {{ ucfirst($order->payment_status) }}

@if($order->transaction_id)
**Transaction ID:** {{ $order->transaction_id }}
@endif

---

## Items Ordered

<x-mail::table>
| Item | Quantity | Price |
|:-----|:--------:|------:|
@foreach($items as $item)
| {{ $item->name }} | {{ $item->quantity }} | ৳{{ number_format($item->price * $item->quantity, 0) }} |
@endforeach
</x-mail::table>

---

**Subtotal:** ৳{{ number_format($order->subtotal, 0) }}  
**Shipping:** {{ $order->shipping_amount > 0 ? '৳' . number_format($order->shipping_amount, 0) : 'Free' }}  
@if($order->discount_amount > 0)
**Discount:** -৳{{ number_format($order->discount_amount, 0) }}  
@endif
**Total:** **৳{{ number_format($order->total_amount, 0) }}**

---

## Shipping Address

{{ $order->customer_name }}  
{{ $order->shipping_address }}  
Phone: {{ $order->customer_phone }}

@if($order->notes)
**Order Notes:** {{ $order->notes }}
@endif

---

<x-mail::button :url="config('app.url') . '/order-confirmation/' . $order->order_number">
View Order Details
</x-mail::button>

If you have any questions about your order, please don't hesitate to contact us.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
