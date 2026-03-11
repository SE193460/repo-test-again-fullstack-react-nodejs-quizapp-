const router = require('express').Router();
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create question
 *     tags: [Question]
 *     responses:
 *       200:
 *         description: Question created
 */
// CREATE question
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin')
            return res.status(403).json({ msg: 'Admin only' });

        const { quizId, text, options, correct } = req.body;

        const question = await Question.create({
            quiz: quizId,
            text,
            options,
            correct
        });

        await Quiz.findByIdAndUpdate(quizId, {
            $push: { questions: question._id }
        });

        res.json(question);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update a question (Admin only)
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correct:
 *                 type: number
 *     responses:
 *       200:
 *         description: Question updated
 *       403:
 *         description: Admin only
 */
// UPDATE question
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Admin only' });

    const q = await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(q);
});

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question (Admin only)
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted
 *       403:
 *         description: Admin only
 */
// DELETE question
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Admin only' });

    await Question.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
});

module.exports = router;