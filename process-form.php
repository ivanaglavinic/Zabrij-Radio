<?php
// Step 1: Define the email to which the form will be sent
$to = "zabrijradio@gmail.com"; // Replace with your email address

// Step 2: Collect and sanitize form data
$name = isset($_POST['fullname']) ? htmlspecialchars($_POST['fullname']) : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
$message = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';

// Step 3: Create the email subject and message body
$subject = "New Contact Form Submission";
$body = "You have received a new message from your website contact form.\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Message:\n$message\n";

// Step 4: Set email headers
$headers = "From: $email" . "\r\n" . "Reply-To: $email";

// Step 5: Send the email
if (mail($to, $subject, $body, $headers)) {
  // Success: Redirect to a thank you page
  header("Location: thank-you.html");
  exit;
} else {
  // Error: Show an error message
  echo "Sorry, there was an issue sending your message. Please try again later.";
}
?>