function createQuizForm() {
  const docId = '1xJ_uYpEsNPzs2MgEso83PLKKs5NE5Mb2AvVmu4a_FIo';
  const doc = DocumentApp.openById(docId);
  const text = doc.getBody().getText();

  const form = FormApp.create("தமிழ் வினா விடை தேர்வு");
  const formId = form.getId();
  form.setIsQuiz(true);

  PropertiesService.getScriptProperties().setProperty('FORM_ID', formId);

  const questionBlocks = text.match(/\d+\..*?(?:Answer:\s*[ABCD])/gs);

  if (!questionBlocks) {
    Logger.log("No questions found.");
    return;
  }

  for (let i = 0; i < questionBlocks.length; i++) {
    const block = questionBlocks[i];
    const match = block.match(
      /\d+\.\s*(.*?)\n\s*A\.\s*(.*?)\n\s*B\.\s*(.*?)\n\s*C\.\s*(.*?)\n\s*D\.\s*(.*?)\n\s*Answer:\s*([ABCD])/s
    );

    if (match) {
      const [, question, optA, optB, optC, optD, correct] = match;
      const questionNumber = i + 1;

      const item = form.addMultipleChoiceItem();
      const choices = [
        item.createChoice("A. " + optA.trim(), correct === "A"),
        item.createChoice("B. " + optB.trim(), correct === "B"),
        item.createChoice("C. " + optC.trim(), correct === "C"),
        item.createChoice("D. " + optD.trim(), correct === "D"),
      ];

      item.setTitle(`${questionNumber}. ${question.trim()}`);
      item.setChoices(choices);
    }
  }

  Logger.log("Form created: " + form.getEditUrl());
}



