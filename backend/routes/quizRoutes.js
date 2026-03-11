const router = require('express').Router();
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: List of quizzes
 */
router.get('/', auth, async (req, res) => {
    const quizzes = await Quiz.find().populate('questions');
    res.json(quizzes);
}
);

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create quiz (admin)
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: Quiz created
 */
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Admin only' });
    const q = await Quiz.create({ title: req.body.title });
    res.json(q);
}
);

router.post('/:quizId/question', auth, async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Admin only' });

    const question = await Question.create({
        text: req.body.text,
        options: req.body.options,
        correct: req.body.correct
    }
    );

    await Quiz.findByIdAndUpdate(req.params.quizId, { $push: { questions: question._id } });
    res.json(question);
});

// UPDATE quiz title
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Admin only' });
    const q = await Quiz.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
    res.json(q);
});

// DELETE quiz
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Admin only' });
    await Quiz.findByIdAndDelete(req.params.id);
    // Ideally delete related questions too
    await Question.deleteMany({ quiz: req.params.id });
    res.json({ msg: 'Quiz and related questions deleted' });
});

module.exports = router;