---
title: "How a Starship Bridge Explains the Neural Network"
subtitle: "The 1940s-to-2010s history of networks that learn from examples, and why one layer was not always enough"
description: "A starship bridge makes neural networks, perceptron training, XOR and backpropagation understandable through worked examples."
sequence: 5
category: "Neural networks"
historicalPeriod: "1943–2017"
author: "Attila Kulik"
tags: ["Neural networks", "Perceptrons", "Backpropagation", "Machine learning"]
listingImage: "/images/starship-bridge-feature.png"
listingImageAlt: "On a starship bridge, two operators send luminous reports through two officers to the captain"
heroImage: "/images/starship-bridge-feature.png"
heroImageAlt: "On a starship bridge, two operators send luminous reports through two officers to the captain"
pubDate: 2026-10-19
draft: false
---

The neural network has no single inventor. Warren McCulloch and Walter Pitts described networks of simple artificial neurons in 1943; Frank Rosenblatt developed a perceptron that learned from examples in the 1950s; and researchers found ways to train networks with hidden layers over the following decades. This article explains the mechanism, traces those contributions, and then puts you in the captain's chair of a starship to work through the numbers.

## What a neural network does

A **neural network** is a program that turns numbers supplied as input into numbers produced as output by passing them through connected arithmetic units. It can learn by adjusting numbers within those connections. Each unit is called an **artificial neuron**, after the nerve cells that inspired it. In the simple model used here, a neuron multiplies each input by a number called a **weight**, adds the results and a further number called the **bias**, then applies an **activation function** to produce its output. The simplest activation is a threshold: output 1 if the total is above zero, and 0 otherwise.

What a network can do depends on both its arrangement of units and the values of its weights and biases. In the **supervised training** used in this article, the network sees examples with known correct outputs and adjusts its weights and biases to reduce its errors. The procedure for making those adjustments is a **learning rule**. A **layer** is a group of neurons that process inputs at the same stage. A **hidden layer** sits between the input and output: its values are calculated by the network, but the examples do not supply correct values for them.

## Who devised it

McCulloch, a neurophysiologist, and Pitts, a logician, showed in a [1943 paper](https://doi.org/10.1007/BF02478259) how networks of simple units could compute logical statements such as "A and B". Their model did not learn from examples. In [*The Organization of Behavior*](https://mlanthology.org/misc/1949/hebb1949misc-organization/) (1949), Donald Hebb proposed that repeated activity involving two nerve cells could strengthen their connection. His proposal was about biological learning, but it helped establish the idea of changing connection strengths.

At the Cornell Aeronautical Laboratory, Rosenblatt developed the **perceptron**, described in a [1958 paper](https://web.stanford.edu/class/psych209a/ReadingsByDate/01_30/Rosenblatt58Perceptron.pdf). Its learning rule changes connection weights when a classification is wrong; the single-neuron version appears below in "Training in the simulator". Rosenblatt and colleagues also built the [Mark I Perceptron](https://americanhistory.si.edu/collections/object/nmah_334414), which used a [20 × 20 array of light sensors](https://www.smithsonianmag.com/innovation/early-days-machine-learning-massive-computers-said-george-harrison-was-woman-ai-come-long-way-180988805/) and several kinds of units. The single captain in this article explains its learning principle; it is not a diagram of that machine. Publicity about the Mark I raised expectations that it could not meet.

In 1969 Marvin Minsky and Seymour Papert published [*Perceptrons*](https://mitpress.mit.edu/9780262130431/perceptrons/), a mathematical analysis of what perceptrons could and could not compute. A single threshold neuron, for example, cannot compute exclusive-or (XOR), as the numbers under "The limit of one captain" show. The book's effect on subsequent research and funding is [still debated](https://journals.sagepub.com/doi/10.1177/030631296026003005). It should not be treated as the sole cause of the broader 1970s **AI winter**, a period of reduced funding and interest in artificial intelligence.

A hidden layer can compute XOR. Training that layer is harder: the examples say whether the final answer is right, but give no correct answer for each hidden neuron. **Backpropagation** calculates how a change in each weight would affect the final error. It works backwards through the network using the chain rule of calculus, multiplying the effects of each step along the way. Seppo Linnainmaa described a general reverse method for calculating derivatives in a [1970 thesis](https://www.finna.fi/Record/helka.9933382303506253), later developed in a [1976 paper](https://doi.org/10.1007/BF01931367). Paul Werbos developed related derivative calculations in his [1974 dissertation](https://gwern.net/doc/ai/nn/1974-werbos.pdf). David Rumelhart, Geoffrey Hinton and Ronald Williams showed in a [1986 paper](https://doi.org/10.1038/323533a0) how backpropagation could train hidden units to represent useful features, bringing the method wide attention.

Later designs extended what trained networks could do. In [1989](https://doi.org/10.1162/neco.1989.1.4.541), Yann LeCun and colleagues used backpropagation to train a **convolutional network**, which reuses sets of weights across an image, to read handwritten US ZIP-code digits. Sepp Hochreiter and Jürgen Schmidhuber introduced [long short-term memory](https://doi.org/10.1162/neco.1997.9.8.1735) (LSTM) in 1997 to help a network retain information over long sequences. In [2012](https://www.cs.toronto.edu/~hinton/absps/imagenet.pdf), Alex Krizhevsky, Ilya Sutskever and Hinton used graphics processors to train a large convolutional network, AlexNet. Its top-five error rate—the proportion of images whose correct category was absent from its five guesses—was 15.3%, compared with 26.2% for the second-best ImageNet entry. In [2017](https://papers.neurips.cc/paper/7181-attention-isall-you-need.pdf), researchers at Google introduced the **transformer**, which uses attention to relate positions in a sequence directly; when generating text, a position cannot attend to future positions. The *Meridian* bridge below returns to the simpler perceptron and the hidden-layer solution to XOR.

## The starship bridge analogy

The bridge of a starship shows how a neuron combines inputs and how learning adjusts its weights. Crew members can send reports to several officers, whose judgements then reach the captain. The ship is an invented survey vessel, the *Meridian*. You will take the captain's chair, train in a simulator, meet the limit of a single captain, add bridge officers, and see what it costs to scale up.

### Bridge key

| In the network | On the *Meridian* |
| --- | --- |
| **Input** | An operator's report: 0 or 1. |
| **Weight** | The points given to a report. |
| **Bias** | The captain's starting lean. |
| **Threshold** | The yes-or-no rule for giving an order. |
| **Output** | The captain's order. |
| **Hidden layer** | Officers whose judgements reach the captain. |
| **Target** | The simulator's correct order. |

### Taking the captain's chair

Imagine you are the captain of the *Meridian*, sitting on the bridge in deep space. The scanner operator reports when a ship appears on the long-range scanner; the communications operator reports when someone hails you. For each encounter, each operator either reports (1) or stays silent (0). These are your two inputs.

You count each report as a fixed number of points. That number is its weight, and it can be negative if a report makes you less inclined to give the order. You also start each encounter with a lean: a cautious captain starts a couple of points down, a bold one a point or two up. That starting lean is the bias. Add the points and the lean. If the score is above zero, you give the order (output 1); if it is zero or below, you do not (output 0). This yes-or-no rule is the threshold activation function.

Suppose the scanner operator's report is worth 2 points, the communications operator's is worth 1, and you start each encounter 2 points down. If both report, the score is 2 × 1 + 1 × 1 − 2 = 1. It is above zero, so you give the order.

![Scanner and hail reports each have a weight; with bias −2, two reports give the captain a score of 1 and an order to act.](/images/starship-bridge-weighted-decision.svg)

### Training in the simulator

New captains learn in a **training simulator**, a mock bridge that plays out encounters with known correct outcomes. That is how supervised training works: each example supplies an input and a target output. Suppose you should open the docking bay only when a ship is both on the scanner and hailing you. This is the function AND. The correct orders are no (0) for (0, 0), (0, 1) and (1, 0), and open the bay (1) for (1, 1).

You begin with no trust in either operator and no lean either way: both weights and the bias are 0. After each encounter, the instructor tells you the correct order. You then apply the perceptron learning rule: change each operator's weight by (correct order − your order) × (that operator's report), and change your lean by (correct order − your order).

With everything at 0, the first three encounters score 0, so you correctly keep the bay closed. The fourth, (1, 1), also scores 0; this time you should have opened it. The error is 1 − 0 = 1, so both weights rise by 1 × 1 = 1 and your lean rises by 1. You now have weights of (1, 1) and a lean of 1.

The second run reveals new errors. The pair (0, 0) scores 0 + 0 + 1 = 1, so you wrongly open the bay to empty space. The correction changes each weight by (0 − 1) × 0 = 0 and your lean by −1, back to 0. Continue presenting encounters in the order (0, 0), (0, 1), (1, 0), (1, 1). Your settings change during runs one to five; the sixth has no errors. You finish with weights of (2, 1) and a lean of −2, the settings used in "Taking the captain's chair". The four encounters now score −2, −1, 0 and 1, so you open the bay only for (1, 1).

Once all four encounters are handled correctly, the rule makes no further changes. Rosenblatt's [**perceptron convergence theorem**](https://gwern.net/doc/ai/nn/1962-rosenblatt-principlesofneurodynamics.pdf) says that, when a set of training examples can be separated by a single threshold neuron, repeated corrections find suitable weights after a finite number of mistakes.

### The limit of one captain

The *Meridian* needs another rule: sound the alert when exactly one operator reports, but not both. This is XOR. A ship that appears on the scanner and hails you has identified itself, while empty space with no voice needs no response. A silent ship on the scanner is suspicious; a voice from empty space suggests a ship the scanner cannot see. So the correct orders are no alert (0) for (0, 0) and (1, 1), and alert (1) for (0, 1) and (1, 0).

Can one captain learn this rule? Write the operators' weights as w1 and w2 and your lean as b. For (0, 0), only the lean counts, and you must stay calm: b ≤ 0. To sound the alert for (0, 1), w2 + b > 0; for (1, 0), w1 + b > 0. Add the last two inequalities and you get w1 + w2 + 2b > 0, or (w1 + w2 + b) + b > 0. Because b ≤ 0, the score w1 + w2 + b must be greater than −b, which is at least 0. You would therefore sound the alert for (1, 1), too. No choice of weights and lean gives all four correct orders. This is a two-input example of the limitations analysed in *Perceptrons*.

![The alert cases in XOR occupy opposite corners of the four report pairs, so one straight decision boundary cannot separate them.](/images/starship-bridge-xor-limit.svg)

### Adding bridge officers

Put two bridge officers between the operators and your chair. Each hears both operators' reports, applies the same yes-or-no rule, and sends you one judgement. The first gives both reports a weight of 1 and starts with a lean of 0. She says yes when at least one operator reports: (0, 0) scores 0 and gets a no, while the other pairs score 1 or 2. The second also gives both reports a weight of 1, but starts at −1. He says yes only when both operators report: (1, 1) scores 1, while either report alone scores 0. The first asks, "Is there any sign of a contact?" The second asks, "Is it both visible and hailing?"

You give the first officer a weight of 1, the second a weight of −1, and start with a lean of 0. You sound the alert when the first says yes and the second says no. For (0, 1), the voice from empty space, only the first says yes. Your score is 1 × 1 − 1 × 0 = 1, so you sound the alert. For (1, 1), both say yes; your score is 1 − 1 = 0, so you stay calm. The bridge officers form the hidden layer. You now receive their judgements instead of the operators' reports directly.

![Both reports reach two bridge officers: one detects any report, the other detects both; the captain alerts only when the first says yes and the second says no.](/images/starship-bridge-hidden-layer.svg)

The simulator gives a correct answer for your final order, but none for either officer's judgement. It can still record what each officer reported. Backpropagation uses those intermediate reports to work backwards from your error and calculate how changing each officer's weights would affect it. In the debrief, the "blame" travels down the chain of command.

An exact yes-or-no threshold blocks ordinary gradient-based backpropagation: its output stays flat as a weight changes slightly, then jumps abruptly. One alternative is the **logistic function**, 1 ÷ (1 + e^−z) for a score z. It returns a value between 0 and 1 that changes smoothly, rather like an officer reporting "seventy per cent sure" instead of simply yes. Other activation functions can also support gradient-based training. To keep the arithmetic visible, the next example lets each person report a score directly.

Let the scanner operator report a ship, x = 1, and let an officer give that report a weight of w = 0.5. She reports a score of h = w × x = 0.5. You give her report a weight of v = 2, so your score is o = v × h = 1. The simulator says the target score is t = 0. With error measured as E = (o − t)², the error is 1² = 1.

The chain rule tells us how a small change in either weight affects E. Changing your weight v changes your score by h; changing your score changes E by 2(o − t). Multiply them: 2 × 1 × 0.5 = 1. Changing the officer's weight w changes her score by x, which changes yours by v. The resulting effect on E is 2 × 1 × 2 × 1 = 4. Together, these two numbers form the **gradient** of the error. In this example, the officer's weight has four times the effect of yours: your weight acts on her score of 0.5, while her weight acts through your weight of 2, and 2 ÷ 0.5 = 4. As a check, raising her weight from 0.5 to 0.51 gives o = 2 × 0.51 = 1.02 and E = 1.02² = 1.0404. The error rises by 0.0404, close to the gradient's prediction of 0.01 × 4 = 0.04.

Training moves each weight a step against its gradient. The step size is set by the **learning rate**. At a rate of 0.1, the officer's weight becomes 0.5 − 0.1 × 4 = 0.1 and yours becomes 2 − 0.1 × 1 = 1.9. Your new score is 1.9 × 0.1 = 0.19, and the error falls from 1 to 0.19² = 0.0361. Repeating this process over training examples can adjust hidden-layer weights even though the simulator provides no target score for the officers.

![A forward pass gives output 1 and error 1; a backward pass finds gradients 1 and 4, allowing both weights to be updated and the error to fall.](/images/starship-bridge-backpropagation.svg)

### Scaling up

The work grows with the size of the crew. Each training example requires a forward pass to calculate the output and a backward pass to calculate the gradients. With 2 operators, a deck of 10 officers, a second deck of 10, and a captain, there are 2 × 10 + 10 × 10 + 10 × 1 = 130 weights, plus 10 + 10 + 1 = 21 biases. A computer can handle this small network easily.

AlexNet had about [60 million parameters](https://www.cs.toronto.edu/~hinton/absps/imagenet.pdf). Its graphics processors helped perform many of the necessary calculations in parallel. More computing power and labelled images helped make the 2012 result possible, alongside advances in network design and training.

## Sources

Historical claims are linked to the publications or records that support them. The *Meridian*, its crew and the simulator encounters are invented for this article. The AND training run, XOR settings and proof, gradient calculation, and network size were checked independently against the arithmetic shown above.
