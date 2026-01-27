# Formspree Email Templates

Use the following HTML code in your Formspree Project Settings > Emails.

---

## 1. Admin Notification Email
**Purpose:** Alerts the Admin (you) when a new form is submitted.
**Configuration:** Set the "To" address to your admin email.

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0284c7; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 8px 8px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 14px; }
    .badge-student { background-color: #e0f2fe; color: #0369a1; }
    .badge-teacher { background-color: #f0fdf4; color: #15803d; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th { text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
    td { padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 500; }
    .footer { margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0;">New Submission Alert</h2>
    </div>
    <div class="content">
      <p>You have received a new submission via the TKMProject website.</p>
      
      <!-- Conditional Badge Display using Formspree/Liquid logic -->
      <div style="margin-bottom: 20px;">
        {% if submission_type == 'Student' %}
          <span class="badge badge-student">Student Registration</span>
        {% elsif submission_type == 'Teacher' %}
          <span class="badge badge-teacher">Teacher Application</span>
        {% else %}
           <span class="badge">General Inquiry</span>
        {% endif %}
      </div>

      <table>
        <!-- Shared Fields -->
        <tr>
          <th width="30%">Date</th>
          <td>{{ timestamp | date: "%d %b %Y, %I:%M %p" }}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td><a href="mailto:{{ _replyto }}">{{ _replyto }}</a></td>
        </tr>
        <tr>
          <th>Phone</th>
          <td>{{ phone }}</td>
        </tr>

        <!-- Student Specific Fields -->
        {% if submission_type == 'Student' %}
        <tr>
          <th>Student Name</th>
          <td>{{ studentName }}</td>
        </tr>
        <tr>
          <th>Parent Name</th>
          <td>{{ parentName }}</td>
        </tr>
        <tr>
          <th>Date of Birth</th>
          <td>{{ studentDob }}</td>
        </tr>
        <tr>
          <th>Class Interest</th>
          <td>{{ classes }} ({{ skillLevel }})</td>
        </tr>
        {% endif %}

        <!-- Teacher Specific Fields -->
        {% if submission_type == 'Teacher' %}
        <tr>
          <th>Applicant Name</th>
          <td>{{ fullName }}</td>
        </tr>
        <tr>
          <th>Instruments</th>
          <td>{{ instruments }}</td>
        </tr>
        <tr>
          <th>Qualifications</th>
          <td>{{ qualifications }}</td>
        </tr>
        {% endif %}
      </table>

      <br>
      <div style="text-align: center;">
        <a href="mailto:{{ _replyto }}" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reply to Sender</a>
      </div>
    </div>
    <div class="footer">
      Sent via Formspree | TKMProject
    </div>
  </div>
</body>
</html>
```

---

## 2. Auto-Response Email (Sender Confirmation)
**Purpose:** Confirms receipt to the user.
**Configuration:** Enabled in Formspree under "Autoresponse".

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .logo { color: #0284c7; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
    .accent { color: #d97706; }
    .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    h1 { color: #111827; font-size: 22px; margin-top: 0; }
    p { margin-bottom: 16px; color: #4b5563; }
    .divider { height: 1px; background-color: #f3f4f6; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">TKM<span class="accent">Project</span></div>
    
    <div class="card">
      <h1>
        {% if submission_type == 'Student' %}
          Registration Received
        {% elsif submission_type == 'Teacher' %}
          Application Received
        {% else %}
          We received your message
        {% endif %}
      </h1>

      <p>Dear {% if studentName %}{{ parentName }}{% elsif fullName %}{{ fullName }}{% else %}Friend{% endif %},</p>

      {% if submission_type == 'Student' %}
        <p>Thank you for registering <strong>{{ studentName }}</strong> for the 2025 intake at TKM Music & Cultural School.</p>
        <p>We have successfully recorded your interest in <strong>{{ classes }}</strong> classes.</p>
      {% elsif submission_type == 'Teacher' %}
        <p>Thank you for your interest in joining the faculty at TKM Music & Cultural School.</p>
        <p>We have received your application regarding <strong>{{ instruments }}</strong> instruction.</p>
      {% else %}
        <p>Thank you for contacting us.</p>
      {% endif %}

      <div class="divider"></div>

      <p><strong>What happens next?</strong></p>
      <p>Our administration team is currently reviewing your submission. You will receive a follow-up email or phone call within <strong>2-3 business days</strong> regarding the next steps.</p>

      <p>If you have any urgent questions, please contact us directly at <a href="mailto:innomok@outlook.com" style="color: #0284c7;">innomok@outlook.com</a>.</p>

      <br>
      <p style="margin-bottom: 0;">Warm regards,<br><strong>The TKMProject Team</strong></p>
    </div>

    <div class="footer">
      818 Ndebele St, Moroka, Soweto, 1818<br>
      © 2025 TKMProject
    </div>
  </div>
</body>
</html>
```
