import { connectToDB } from "@utils/database";
import chatbot from "@/models/chatbot";

export async function POST(req) {
  await connectToDB();

  const faqs = [
  {
    question: "How to upload a file?",
    answer: "To upload a file, click on 'Upload' button on the Home Page, choose your PDF, and fill in the required fields."
  },
  {
    question: "How to scan a document?",
    answer: "Click on the 'Scan' button on the Home Page and use the scan option to convert physical documents into PDF format, then fill in the necessary data."
  },
  {
    question: "How to view overdue mails?",
    answer: "Go to the Overdue Mails section on the 'Home' Page to view files with open status that are past due."
  },
  {
    question: "How do I search for a specific file?",
    answer: "Use the search bar at the top of the file list. You can search by subject, diary number, or keywords."
  },
  {
    question: "How to change file status?",
    answer: "Click on any file, then click 'Change Status' and select the appropriate status like 'Closed'."
  },
  {
    question: "How can I see recently uploaded files?",
    answer: "Visit the home page and scroll to the 'Recent Files' section to see the latest activity."
  },
  {
    question: "How can I filter files by department or category?",
    answer: "Navigate to the 'Departments' tab, select a department, and then choose a category to filter the files."
  },
  {
    question: "How to manage departments?",
    answer: "Go to the 'Manage Departments' section to add, edit, or delete department entries."
  },
  {
    question: "Where is a file stored after uploading?",
    answer: "All files are stored securely in the system and categorized under their assigned department and category. You can view them through the 'View Files' section."
  },
  {
    question: "How can I report a problem or contact the developer?",
    answer: "Go to the 'Contact Developer' form in the navigation, fill in your name, email, and issue details, and submit the form."
  },
  {
    question: "What should I do if a file is not appearing after upload?",
    answer: "Check the department/category filters. If still not found, verify that the file was successfully uploaded or check the 'Recent Files' section. If still not found then contact the developer through contact form."
  },
  {
    question: "Is there any confirmation after successful upload?",
    answer: "Yes, once a file is successfully uploaded or scanned, a success message appears and the file will be listed in the dashboard."
  },
  {
    question: "Can I log out from the system?",
    answer: "Yes, click on your profile icon and select 'Logout' to securely exit the system."
  },
  {
    question: "How to manage categories?",
    answer: "Go to 'Manage Categories' and select the department first, then add/edit/delete categories."
  },
  {
    question: "What happens when a file is marked as overdue?",
    answer: "It appears in the 'Overdue Mails' section until its status is changed to something other than 'Open'."
  },
  {
    question: "How to log in?",
    answer: "Go to the login page and enter your admin email and password provided by the system owner."
  },
  {
    question: "What file types can I upload?",
    answer: "Currently, only PDF files are supported for upload."
  },
  {
    question: "Is my data safe in the system?",
    answer: "Yes, the system restricts access to verified admins and securely stores all files and user credentials."
  },
  {
    question: "Can I search files by subject or keywords?",
    answer: "Yes, you can use the search bar to find files by subject, keywords, or diaryno."
  },
  {
    question: "How does the chatbot work?",
    answer: "The chatbot answers your questions using a built-in knowledge base and OpenAI API if needed."
  },
  {
    question: "What if the category dropdown is empty when uploading a file?",
    answer: "Make sure a department is selected first. Categories are linked to departments, and will only load once a department is chosen."
  },
  {
    question: "Why is the file status not updating after clicking 'Change Status'?",
    answer: "Ensure the file was originally in 'Open' status and that you confirmed the new status in the popup. Try refreshing the page if the issue persists."
  },
  {
    question: "How can I view the full details of a file after upload?",
    answer: "Go to 'View Files', click on the specific file, and a detailed view including diary number, subject, type, and timestamps will appear."
  },
  {
    question: "What if I accidentally uploaded a wrong file?",
    answer: "Navigate to 'View Files', locate the file, and use the 'Delete' option. Then re-upload the correct file."
  },
  {
    question: "Can I track which admin uploaded or edited a file?",
    answer: "Currently, the system does not track individual admin activity, but version control may be introduced in future updates."
  },
  {
    question: "What should I do if the scan button does not respond?",
    answer: "Ensure your device has a scanner or camera access enabled. Also, check browser permissions for using the device scanner."
  },
  {
    question: "Why is the file not categorized even after selecting a department and category?",
    answer: "Check if the category exists under the selected department. Categories are department-specific, so mismatched selection may lead to uncategorized files."
  },
  {
    question: "Can I download a file after uploading it?",
    answer: "Yes, go to 'View Files', click on the file, and use the download icon or button to save a copy locally."
  },
  {
    question: "Why does the Contact Developer form show an error on submit?",
    answer: "Ensure all required fields are filled and your internet connection is active. If the issue persists, the backend may be temporarily down."
  },
  {
    question: "Is there any size limit for uploaded PDF files?",
    answer: "Yes, currently the system supports files up to 10MB. If a file exceeds the limit, compress it or split before uploading."
  },
  {
    question: "Can I search files by status, like 'open' or 'closed'?",
    answer: "Yes, use the advanced filter option in the 'View Files' section to filter by status."
  },
  {
    question: "How can I ensure a file is assigned to the correct category?",
    answer: "Double-check the selected department and category before clicking upload. After upload, verify from the file list by filtering."
  },
  {
    question: "What happens if I upload the same file twice?",
    answer: "The system currently does not block duplicates. If duplicate detection is needed, use unique diary numbers or implement version checks manually."
  },
  {
    question: "How do I know if my file has been uploaded successfully?",
    answer: "A success message will appear, and the file will be listed in the 'Recent Files' section instantly."
  },
  {
    question: "Can I edit the subject or category of a file after uploading it?",
    answer: "Yes, click on the file in 'View Files' and choose 'Edit'. You can then update the subject, department, or category."
  }

]

  await chatbot.insertMany(faqs);

  return Response.json({ message: "FAQs seeded successfully!" });
}
