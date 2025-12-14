<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reply to Your Message</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #16a34a;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .reply-section {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #16a34a;
        }
        .original-section {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
            color: #6b7280;
        }
        .original-section h4 {
            margin: 0 0 10px 0;
            color: #374151;
        }
        .footer {
            background-color: #1f2937;
            color: #9ca3af;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 8px 8px;
        }
        .footer a {
            color: #16a34a;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">{{ config('app.name', 'E-Club Store') }}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Response to Your Inquiry</p>
    </div>
    
    <div class="content">
        <p>Dear {{ $originalMessage->name }},</p>
        
        <p>Thank you for contacting us. Here is our response to your inquiry:</p>
        
        <div class="reply-section">
            {!! nl2br(e($replyContent)) !!}
        </div>
        
        <div class="original-section">
            <h4>Your Original Message:</h4>
            <p><strong>Subject:</strong> {{ $originalMessage->subject }}</p>
            <p><strong>Date:</strong> {{ $originalMessage->created_at->format('M d, Y \a\t h:i A') }}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line;">{{ $originalMessage->message }}</p>
        </div>
        
        <p style="margin-top: 20px;">
            If you have any further questions, please don't hesitate to reply to this email or contact us again.
        </p>
        
        <p>
            Best regards,<br>
            {{ $repliedBy }}<br>
            {{ config('app.name', 'E-Club Store') }} Team
        </p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name', 'E-Club Store') }}. All rights reserved.</p>
        <p>
            <a href="{{ config('app.url') }}">Visit our website</a> |
            <a href="{{ config('app.url') }}/contact">Contact Us</a>
        </p>
    </div>
</body>
</html>
