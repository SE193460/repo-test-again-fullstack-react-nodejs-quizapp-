import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchQuiz } from '../features/quiz/quizSlice';
import './Admin.css';

export default function AdminDashboard() {
    const { token, user } = useSelector(s => s.auth);
    const { list: quizzes } = useSelector(s => s.quiz);
    const dispatch = useDispatch();

    const [selectedQuizId, setSelectedQuizId] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctIndex, setCorrectIndex] = useState(0);
    const [msg, setMsg] = useState('');

    const [newQuizTitle, setNewQuizTitle] = useState('');
    const [quizMsg, setQuizMsg] = useState('');

    useEffect(() => {
        if (token) dispatch(fetchQuiz(token));
    }, [token, dispatch]);

    useEffect(() => {
        if (quizzes.length > 0 && !selectedQuizId) {
            setSelectedQuizId(quizzes[0]._id);
        }
    }, [quizzes, selectedQuizId]);

    const createQuiz = async () => {
        if (!newQuizTitle.trim()) return setQuizMsg('Quiz title cannot be empty');
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/quizzes`,
                { title: newQuizTitle },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuizMsg('Quiz created successfully!');
            setNewQuizTitle('');
            dispatch(fetchQuiz(token)); // Refresh quiz list
            setSelectedQuizId(res.data._id); // Auto-select the newly created quiz
        } catch (e) {
            setQuizMsg('Error creating quiz');
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addQuestion = async () => {
        if (!selectedQuizId) return setMsg('Select a quiz first');
        try {
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/questions`,
                { quizId: selectedQuizId, text: questionText, options, correct: parseInt(correctIndex) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMsg('Question added');
            setQuestionText('');
            setOptions(['', '', '', '']);
            setCorrectIndex(0);
            dispatch(fetchQuiz(token)); // Refresh quiz list to show new question
        } catch (e) {
            setMsg('Error adding question');
        }
    };

    const deleteQuestion = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/questions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('Question deleted');
            dispatch(fetchQuiz(token));
        } catch {
            setMsg('Error deleting');
        }
    };

    const deleteQuiz = async () => {
        if (!selectedQuizId) return setMsg('Select a quiz first');
        if (!window.confirm("Are you sure you want to delete this quiz? All related questions will be deleted.")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/quizzes/${selectedQuizId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('Quiz deleted');
            const remaining = quizzes.filter(q => q._id !== selectedQuizId);
            setSelectedQuizId(remaining.length > 0 ? remaining[0]._id : '');
            dispatch(fetchQuiz(token));
        } catch {
            setMsg('Error deleting quiz');
        }
    };

    if (user?.role !== 'admin')
        return <Layout><div style={{ padding: 40 }}>Not admin</div></Layout>;

    const selectedQuiz = quizzes.find(q => q._id === selectedQuizId);

    return (
        <Layout>
            <div className="admin-container">
                <h2 className="admin-section-title">Manage Quizzes</h2>

                <div className="add-question-card" style={{ marginBottom: '2rem' }}>
                    <div className="admin-form-group">
                        <label>New Quiz Title:</label>
                        <div className="admin-form-inputs">
                            <input
                                className="admin-input"
                                value={newQuizTitle}
                                onChange={e => setNewQuizTitle(e.target.value)}
                                placeholder="Enter quiz title..."
                            />
                        </div>
                    </div>
                    <button className="add-question-btn" onClick={createQuiz}>
                        Create Quiz
                    </button>
                    {quizMsg && <p style={{ textAlign: 'center', marginTop: '1rem', color: quizMsg.includes('Error') || quizMsg.includes('empty') ? 'red' : 'green' }}>{quizMsg}</p>}
                </div>

                <h2 className="admin-section-title">Questions</h2>

                <div className="quiz-selector" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <label>Manage for Quiz: </label>
                    <select value={selectedQuizId} onChange={e => setSelectedQuizId(e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px' }}>
                        {quizzes.map(q => (
                            <option key={q._id} value={q._id}>{q.title}</option>
                        ))}
                    </select>
                    {selectedQuizId && (
                        <button className="admin-btn btn-delete" onClick={deleteQuiz} style={{ margin: 0, padding: '0.4rem 0.8rem' }}>
                            Delete Quiz
                        </button>
                    )}
                </div>

                <div className="add-question-card">
                    <div className="admin-form-group">
                        <label>Question Text:</label>
                        <div className="admin-form-inputs">
                            <input
                                className="admin-input"
                                value={questionText}
                                onChange={e => setQuestionText(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label>Options:</label>
                        <div className="admin-form-inputs">
                            {options.map((opt, i) => (
                                <input
                                    key={i}
                                    className="admin-input"
                                    value={opt}
                                    onChange={e => handleOptionChange(i, e.target.value)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label>Correct Answer Index:</label>
                        <div className="admin-form-inputs">
                            <input
                                type="number"
                                className="admin-input"
                                value={correctIndex}
                                onChange={e => setCorrectIndex(e.target.value)}
                                min="0"
                                max="3"
                            />
                        </div>
                    </div>

                    <button className="add-question-btn" onClick={addQuestion}>
                        Add Question
                    </button>
                    {msg && <p style={{ textAlign: 'center', marginTop: '1rem', color: msg.includes('Error') ? 'red' : 'green' }}>{msg}</p>}
                </div>

                {selectedQuiz?.questions?.map((q) => (
                    <div key={q._id || q.text} className="question-item-card">
                        <h3 className="question-item-text">{q.text}</h3>
                        <ul className="question-item-options">
                            {q.options?.map((opt, i) => (
                                <li key={i}>{opt}</li>
                            ))}
                        </ul>
                        <div className="admin-actions">
                            <button className="admin-btn btn-edit">Edit</button>
                            <button className="admin-btn btn-delete" onClick={() => deleteQuestion(q._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}