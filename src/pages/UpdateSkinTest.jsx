import React, { useState } from 'react';

const UpdateSkinTest = () => {
  const [questions, setQuestions] = useState([{
    id: 1,
    content: '',
    answers: [{ id: 1, text: '', skinType: 'Da đầu' }],
  }]);

  const handleQuestionChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, content: value } : q))
    );
  };

  const handleAnswerChange = (qId, aId, key, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === aId ? { ...a, [key]: value } : a
              ),
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      content: '',
      answers: [{ id: 1, text: '', skinType: 'Da đầu' }],
    };
    setQuestions([...questions, newQuestion]);
  };

  const addAnswer = (qId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              answers: [
                ...q.answers,
                { id: q.answers.length + 1, text: '', skinType: 'Da đầu' },
              ],
            }
          : q
      )
    );
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const removeAnswer = (qId, aId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, answers: q.answers.filter((a) => a.id !== aId) }
          : q
      )
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Tạo bộ câu hỏi</h1>
      <input
        type="text"
        placeholder="Tên bộ câu hỏi"
        className="border p-2 w-full mb-4"
      />
      {questions.map((question) => (
        <div key={question.id} className="border p-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Câu hỏi {question.id}</h2>
            <button
              className="text-red-500"
              onClick={() => removeQuestion(question.id)}
            >
              🗑️
            </button>
          </div>
          <textarea
            placeholder="Nội dung câu hỏi"
            value={question.content}
            onChange={(e) => handleQuestionChange(question.id, e.target.value)}
            className="border p-2 w-full my-2"
          />
          {question.answers.map((answer) => (
            <div key={answer.id} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder={`Đáp án ${answer.id}`}
                value={answer.text}
                onChange={(e) =>
                  handleAnswerChange(question.id, answer.id, 'text', e.target.value)
                }
                className="border p-2"
              />
              <select
                value={answer.skinType}
                onChange={(e) =>
                  handleAnswerChange(question.id, answer.id, 'skinType', e.target.value)
                }
                className="border p-2"
              >
                <option value="Da đầu">Da đầu</option>
                <option value="Da dầu">Da dầu</option>
                <option value="Da khô">Da khô</option>
              </select>
              <button
                className="text-red-500"
                onClick={() => removeAnswer(question.id, answer.id)}
              >
                🗑️
              </button>
            </div>
          ))}
          <button
            className="text-red-500 mt-2"
            onClick={() => addAnswer(question.id)}
          >
            ➕ Thêm đáp án
          </button>
        </div>
      ))}
      <div className="flex space-x-4 mt-4">
        <button
          className="bg-red-400 text-white p-2 rounded-lg"
          onClick={addQuestion}
        >
          Thêm câu hỏi
        </button>
        <button className="bg-green-500 text-white p-2 rounded-lg">
          Lưu bộ câu hỏi
        </button>
      </div>
    </div>
  );
};

export default UpdateSkinTest;
