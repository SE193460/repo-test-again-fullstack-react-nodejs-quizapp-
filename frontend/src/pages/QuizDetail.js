import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../components/Layout';
import './Quiz.css';

export default function QuizDetail() {
    const { state } = useLocation();
    const quiz = state?.quiz;

    const [answers, setAnswers] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [score, setScore] = useState(0);

    if (!quiz) return <Layout><div style={{ padding: 40 }}>No quiz</div></Layout>;

    const choose = (qIndex, optIndex) => {
        setAnswers({ ...answers, [qIndex]: optIndex });
    };

    const submit = () => {
        let currentScore = 0;
        quiz.questions.forEach((q, i) => {
            if (answers[i] === q.correct) currentScore++;
        });
        setScore(currentScore);
        setIsCompleted(true);
    };

    const restart = () => {
        setAnswers({});
        setScore(0);
        setIsCompleted(false);
    };

    if (isCompleted) {
        return (
            <Layout>
                <div className="results-wrapper">
                    <h2>Quiz Completed</h2>
                    <p className="score-text">Your score: {score}</p>
                    <button className="restart-btn" onClick={restart}>
                        Restart Quiz
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="quiz-detail-container">
                <h2 className="quiz-title">Quiz</h2>

                {quiz.questions.map((q, i) => (
                    <div key={i} className="question-card">
                        <div className="question-text">{q.text}</div>

                        <div className="options-container">
                            {q.options.map((op, j) => (
                                <label key={j} className="option-item">
                                    <input
                                        type="radio"
                                        name={`q${i}`}
                                        checked={answers[i] === j}
                                        onChange={() => choose(i, j)}
                                    />
                                    {op}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <button className="submit-quiz-btn" onClick={submit}>
                    Submit Answer
                </button>
            </div>
        </Layout>
    );
}