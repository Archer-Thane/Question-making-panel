import {Quiz} from "@/models/Quiz";
// import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';
import '@/assets/scss/markdownKatex.scss';
var md = require('markdown-it')(),
    mk = require('markdown-it-katex');
md.use(mk);

const mixinQuiz = {
  computed: {
    currentQuestionBody() {
      return md.render(this.currentQuestion.body)
    },
    isQuizPage() {
      return this.$route.name === 'onlineQuiz.quiz'
    },
    userAnswersOfOnlineQuiz() {
      return this.$store.getters.userAnswersOfOnlineQuiz
    },
    quiz: {
      get () {
        return this.$store.getters.quiz
      },
      set (newInfo) {
        this.$store.commit('updateQuiz', newInfo)
      }
    },
    currentQuestion: {
      get () {
        return this.$store.getters.currentQuestion
      },
      set (newInfo) {
        this.$store.commit('updateCurrentQuestion', newInfo)
      }
    },
    currentLessons () {
      return this.quiz.sub_categories.getItem('id', this.currentQuestion.sub_category.id)
    }
  },
  methods: {
    loadFirstQuestion () {
      this.loadQuestionByNumber(1)
    },
    loadQuestionByNumber (number) {
      let questionIndex = this.getQuestionIndexFromNumber(number)
      this.changeQuestion(this.quiz.questions.list[questionIndex].id)
    },
    answerClicked (data) {
      // this.quiz.questions.getQuestionById(data.questionId).choiceClicked(data.choiceId)
      this.$store.commit('answerQuestion', data)
    },
    bookmark () {
      this.quiz.questions.getQuestionById(this.currentQuestion.id).bookmark()
    },
    changeState (newState) {
      this.quiz.questions.getQuestionById(this.currentQuestion.id).changeState(newState)
    },
    loadQuiz () {
      this.quiz = new Quiz(this.quizData)
      this.quiz.loadSubcategoriesOfCategories()
    },
    loadUserAnswers () {
      this.quiz.setUserAnswers(this.userAnswersOfOnlineQuiz)
    },
    getQuestionNumberFromIndex (index) {
      index = parseInt(index)
      return index + 1
    },
    getQuestionNumberFromId (id) {
      const questionIndex = this.quiz.questions.getIndex('id', id)
      return this.getQuestionNumberFromIndex(questionIndex)
    },
    getQuestionIndexFromNumber (number) {
      number = parseInt(number)
      return number - 1
    },
    goToNextQuestion () {
      let question = this.quiz.questions.getNextQuestion(this.currentQuestion.id)
      if (!question) {
        return
      }
      this.changeQuestion(question.id)
    },
    goToPrevQuestion () {
      let question = this.quiz.questions.getPrevQuestion(this.currentQuestion.id)
      if (!question) {
        return
      }
      this.changeQuestion(question.id)
    },
    changeQuestion(id) {
      if (parseInt(this.currentQuestion.id) === parseInt(id)) {
        return
      }

      const questIndex = this.quiz.questions.getQuestionIndexById(id),
          questNumber = this.getQuestionNumberFromIndex(questIndex)

      this.currentQuestion = this.quiz.questions.getQuestionById(id)

      if (parseInt(this.$route.params.questNumber) !== parseInt(questNumber)) {
          this.$router.push({ name: 'onlineQuiz.quiz', params: { quizId: this.quiz.id, questNumber } })
      }
    }
  }
}

export default mixinQuiz
