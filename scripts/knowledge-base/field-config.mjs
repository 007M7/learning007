export const updatedAt = "2026-08-31";

export const fields = {
  "machine-learning": {
    title: "机器学习",
    paperQueries: [
      ["statistical-learning", "statistical learning theory generalization empirical risk minimization VC dimension"],
      ["data-evaluation", "data leakage dataset shift benchmark evaluation machine learning"],
      ["linear-probabilistic", "logistic regression probabilistic classifiers calibration machine learning"],
      ["trees-boosting", "decision trees random forests gradient boosting"],
      ["kernels-representation", "support vector machine kernel methods manifold learning"],
      ["optimization-regularization", "machine learning regularization hyperparameter optimization cross validation"],
      ["automl-tabular", "automl tabular machine learning foundation models"],
      ["causal-inference", "causal inference machine learning treatment effect experimentation"],
      ["uncertainty-fairness", "uncertainty quantification conformal prediction algorithmic fairness"],
      ["production-ml", "production machine learning MLOps monitoring data cascades"]
    ]
  },
  "deep-learning": {
    title: "深度学习",
    paperQueries: [
      ["backprop-autodiff", "backpropagation automatic differentiation neural network training"],
      ["optimization", "deep learning optimization SGD Adam normalization initialization"],
      ["vision", "convolutional neural networks vision transformer representation"],
      ["sequence", "transformer attention state space sequence models"],
      ["scaling-data", "neural scaling laws pretraining data deep learning"],
      ["post-training", "instruction tuning preference optimization reinforcement learning language models"],
      ["generative", "diffusion models flow matching autoregressive generative models"],
      ["multimodal-world", "multimodal foundation models vision language world models"],
      ["efficient-inference", "deep learning quantization pruning mixture experts efficient inference"],
      ["evaluation-safety", "foundation model evaluation interpretability robustness AI safety"]
    ]
  },
  nlp: {
    title: "自然语言处理（NLP）",
    paperQueries: [
      ["tasks-corpora", "natural language processing tasks corpora annotation data statements"],
      ["tokenization", "tokenization morphology byte pair encoding multilingual NLP"],
      ["semantics-embeddings", "distributional semantics word embeddings sentence embeddings"],
      ["encoders-decoders", "sequence to sequence BERT T5 encoder decoder NLP"],
      ["pretraining-adaptation", "language model pretraining fine tuning prompting adaptation"],
      ["structured-language", "named entity recognition relation extraction structured generation"],
      ["generation", "text generation dialogue summarization machine translation evaluation"],
      ["multilingual", "multilingual NLP low resource cross lingual cultural"],
      ["retrieval-context", "retrieval augmented generation long context question answering"],
      ["factuality-evaluation", "factuality hallucination NLP evaluation language model judge"]
    ]
  },
  "ai-product": {
    title: "AI 产品经理",
    paperQueries: [
      ["problem-discovery", "human centered AI interaction design problem formulation user needs"],
      ["workflow", "human AI collaboration workflow decision support field study"],
      ["capability-architecture", "foundation model application architecture model cards AI agents retrieval augmented generation"],
      ["evaluation", "generative AI systems evaluation human evaluation LLM benchmarks"],
      ["experimentation", "online controlled experiments A B testing technology products"],
      ["ux-trust", "human AI interaction trust calibration explanations user study"],
      ["economics", "economics of artificial intelligence productivity cost adoption"],
      ["governance", "AI risk management privacy governance impact assessment"],
      ["operations", "MLOps technical debt production machine learning monitoring data validation"],
      ["strategy-organization", "artificial intelligence strategy organizational capabilities competitive advantage"]
    ]
  },
  "low-altitude": {
    title: "物理 AI · 低空智能",
    paperQueries: [
      ["system-regulation", "unmanned aircraft systems regulation airworthiness operations"],
      ["aerodynamics", "unmanned aerial vehicle flight dynamics aerodynamics weather"],
      ["vehicle-propulsion", "eVTOL UAV propulsion battery aircraft configuration"],
      ["sense-avoid", "unmanned aircraft detect and avoid perception sensors"],
      ["navigation", "UAV localization navigation GNSS visual inertial"],
      ["control-planning", "UAV flight control trajectory planning autonomous"],
      ["utm-c2", "unmanned aircraft traffic management command control remote identification"],
      ["fleet-infrastructure", "urban air mobility vertiport fleet operations infrastructure"],
      ["swarm-simulation", "multi UAV swarm coordination simulation digital twin"],
      ["safety-business", "advanced air mobility aviation safety risk certification operational economics"]
    ]
  },
  robotics: {
    title: "物理 AI · 机器人",
    paperQueries: [
      ["embodiment-system", "embodied intelligence robotics manipulation navigation benchmark"],
      ["kinematics-dynamics", "robot kinematics dynamics rigid body Lie groups manipulation"],
      ["control", "robotics trajectory optimization model predictive control contact dynamics"],
      ["perception-state", "robot perception 3D state estimation calibration"],
      ["slam-navigation", "robot SLAM navigation localization planning"],
      ["manipulation", "robot manipulation grasping dexterous control"],
      ["learning", "robot imitation learning reinforcement learning offline manipulation"],
      ["vla-foundation", "vision language action models robotics manipulation"],
      ["sim2real-world", "robotics sim to real domain randomization world models"],
      ["safety-hri", "robot safety human robot interaction deployment evaluation"]
    ]
  }
};
