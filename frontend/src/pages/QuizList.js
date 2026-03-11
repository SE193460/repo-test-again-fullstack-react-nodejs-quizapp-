import { useSelector, useDispatch } from 'react-redux';
import { fetchQuiz } from '../features/quiz/quizSlice';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import './Dashboard.css';

export default function QuizList() {
    const { token } = useSelector(s => s.auth);
    const { list } = useSelector(s => s.quiz);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) dispatch(fetchQuiz(token));
    }, [token, dispatch]);

    return (
        <Layout>
            <div className="quiz-list-content">
                <div className="quiz-grid">
                    {list.map(q => (
                        <Link
                            key={q._id}
                            to="/quiz"
                            state={{ quiz: q }}
                            className="quiz-card"
                        >
                            <h3>{q.title}</h3>
                            <p>{q.questions?.length || 0} Questions</p>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
}