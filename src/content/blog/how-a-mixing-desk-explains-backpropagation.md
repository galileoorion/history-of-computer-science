---
title: "How a Mixing Desk Explains Backpropagation"
subtitle: "Two faders, a target level and one backward pass show how a network changes its weights"
description: "Follow a small mixing-desk example to see how a neural network measures error, calculates gradients and updates weights by backpropagation."
sequence: 13
category: "Neural networks"
historicalPeriod: "1958–1989"
author: "Attila Kulik"
tags: ["Backpropagation", "Gradient descent", "Neural networks", "Machine learning"]
heroImage: "/images/mixing-desk-backprop-feature.png"
heroImageAlt: "Analogue recording-studio mixing desk with rows of channel faders and a red master fader under warm lamplight"
pubDate: 2026-10-25
draft: false
---

Imagine adjusting the level of a recorded sound. You move a channel fader. The signal passes through a master fader, and a meter shows the final level. You have a reference level to match. If the meter reads too high, which fader should you move and by how much?

A neural network faces a related problem when it learns from examples. Its adjustable numbers, called **weights**, change how strongly signals pass from one stage to the next. Given an example with a known answer, the network produces an output, measures how far it is from that answer, and calculates how changing each weight would change the error. **Backpropagation** is the calculation that carries this information backward through the stages. An update rule then adjusts the weights.

The mixing desk makes those stages visible. Our tiny example has only two faders and one signal, so we can follow every number. A practical network has many more connections, but the same question runs through it: *which settings contributed to this error?*

## Match a target level

Suppose an input signal at level `1` passes through a **channel fader** set to `0.5`, then a **master fader** set to `2`. Treat the settings as multipliers. The first stage gives `1 × 0.5 = 0.5`; the second gives `0.5 × 2 = 1`. For this invented exercise, the desired output is `0.6`.

| On the desk | In the network | Value |
| --- | --- | ---: |
| Incoming signal | Input `x` | `1` |
| Channel-fader setting | First weight `w` | `0.5` |
| Level after that fader | Intermediate value `h = w × x` | `0.5` |
| Master-fader setting | Second weight `v` | `2` |
| Final meter reading | Output `o = v × h` | `1` |
| Reference reading | Target `t` | `0.6` |

The meter is **0.4 too high**. Training needs a single number that measures the mismatch. One choice is **squared error**: `E = (o − t)²`. Here, `E = (1 − 0.6)² = 0.16`. This number is the **loss** for this example. Squaring makes a larger miss cost more and gives a smooth curve for the calculation below. Other tasks use other loss functions; this one is chosen to keep the arithmetic short.

![A signal of 1 passes through a channel weight of 0.5 and a master weight of 2, producing an output of 1 when the target is 0.6. The backward pass calculates loss sensitivities of 0.4 for the master weight and 1.6 for the channel weight.](/images/mixing-desk-backprop-flow.svg)

*The forward pass produces the meter reading. The backward pass asks how strongly each setting affects the loss.*

## Work backward from the error

Moving the two faders by the same amount will not have the same effect. The channel fader's signal is multiplied again by the master fader. To choose useful adjustments, we need the **gradient**: how much a small change in each weight would change the loss while the other weight stayed fixed.

Start at the end. The output is `0.4` above the target, and the slope of `E = (o − t)²` at `o = 1` is `2 × (1 − 0.6) = 0.8`. In other words, a small increase in the output would increase the loss by about `0.8` times that increase.

Now trace that effect through each fader:

- **Master fader:** changing `v` by a small amount changes the output by `h = 0.5` times that amount. Its loss sensitivity is `0.8 × 0.5 = 0.4`.
- **Channel fader:** changing `w` by a small amount changes `h` by `x = 1` times that amount. The master fader then multiplies that change by `v = 2`. Its loss sensitivity is `0.8 × 2 × 1 = 1.6`.

The channel fader has four times the local effect on the loss: `1.6` versus `0.4`. Multiplying the effects of successive stages is the **chain rule** of calculus. Backpropagation applies that rule from the loss toward earlier weights. In a larger network, it also adds contributions when one earlier value feeds several later paths. The name describes the direction of the *calculation*; the original sound is not played backward.

## Move both faders

The **learning rate** sets the size of the move. With a learning rate of `0.1`, subtract `0.1` times each sensitivity from its current weight. Both sensitivities were calculated from the old settings, so the two updates belong to the same step:

```text
channel:  w = 0.5 − 0.1 × 1.6 = 0.34
master:   v = 2   − 0.1 × 0.4 = 1.96
```

Play the signal through the adjusted desk. The intermediate level is `1 × 0.34 = 0.34`, and the output is `0.34 × 1.96 = 0.6664`. The new loss is `(0.6664 − 0.6)² = 0.00440896`, down from `0.16`. The meter has moved closer to the target after **one** update.

This is **gradient descent**: calculate the direction in which each weight locally increases the loss, then take a step in the opposite direction. Backpropagation supplies the sensitivities; gradient descent uses them to change the weights. A step does not always improve the result. A learning rate that is too large can jump past a good setting, and a single example does not tell us whether the settings work for other signals.

## From one signal to a trained network

Real training repeats this cycle over many examples. A network makes predictions, compares them with the relevant answers to calculate a loss, works backward to find the weights' sensitivities, and updates them. It may use one example or a batch of examples per update. After enough updates, the aim is to do well on **new** examples, not merely to remember those used in training. Separate test examples help check that distinction.

The two-fader desk is deliberately **linear**: each stage only multiplies its input. Two such stages together are just one multiplier, `v × w`, so stacking more of them alone would not give a network the ability to learn more complicated patterns. Actual neural networks insert **nonlinear activation functions** between weighted stages. Those functions must have useful slopes for ordinary gradient-based backpropagation. The [earlier neural-network post](/how-a-starship-bridge-explains-the-neural-network/) shows why a single threshold unit cannot solve XOR and how an intermediate layer helps.

The same training loop appears in the [convolutional-network post](/how-a-sliding-stencil-explains-convolutional-neural-networks/): the adjustable weights are filter values, and backpropagation tells the network how to change them after an image prediction misses its target. The [GAN post](/how-a-wildlife-field-guide-explains-gans/) uses a related backward calculation in a different training arrangement. Its generator does not receive a correct target image for each random input. Instead, feedback passes through a discriminator, which is itself being trained. Our reference meter reading illustrates straightforward supervised learning; it does not reproduce that two-network contest.

The sound-engineer analogy has another limit. A person may listen and decide that a mix feels right. A network follows a specified numerical loss, which may fail to capture everything people care about. Faders on a real desk also have physical ranges and affect the sound in ways this simple model ignores; network weights can be negative, and their intermediate signals need not correspond to sounds anyone could hear.

## How the method developed

Learning by changing connection strengths predates today's large networks. Frank Rosenblatt's [1958 perceptron paper](https://web.stanford.edu/class/psych209a/ReadingsByDate/01_30/Rosenblatt58Perceptron.pdf) described an early model with adjustable connections. Bernard Widrow and Marcian Hoff's [1960 work on adaptive switching circuits](https://isl.stanford.edu/~widrow/papers/c1960adaptiveswitching.pdf) described learning from input examples and desired outputs. These were important ways to tune relatively simple systems; they did not by themselves solve how to assign an output error to adjustable connections inside many hidden stages.

The backward calculation has a broader history than neural networks. Seppo Linnainmaa's [1970 thesis, cited in his 1976 paper](https://doi.org/10.1007/BF01931367) described a way to work backwards through a calculation to determine how local numerical errors affect a final result. Paul Werbos developed related derivative calculations in his [1974 dissertation](https://gwern.net/doc/ai/nn/1974-werbos.pdf). In [1986, David Rumelhart, Geoffrey Hinton and Ronald Williams](https://doi.org/10.1038/323533a0) showed how repeated backward error calculations could train hidden units to represent useful features. Their paper brought widespread attention to multilayer backpropagation. These contributions addressed related problems at different times; there was no single moment when the entire modern training method appeared fully formed.

Backpropagation later supported practical image-recognition systems. In [1989, Yann LeCun and colleagues](https://papers.nips.cc/paper_files/paper/1989/file/53c3bce66e43be4f209556518c2fcb54-Paper.pdf) applied it to a network that read handwritten US ZIP-code digits from images. In that network, the settings were far less visible than faders on a desk, but the essential loop was the same: **produce an output, measure a mistake, trace its effects backward, adjust, and try again**.

## Sources

- Frank Rosenblatt, [“The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain”](https://web.stanford.edu/class/psych209a/ReadingsByDate/01_30/Rosenblatt58Perceptron.pdf), *Psychological Review*, 1958. Early model with adjustable connections.
- Bernard Widrow and Marcian E. Hoff, [“Adaptive Switching Circuits”](https://isl.stanford.edu/~widrow/papers/c1960adaptiveswitching.pdf), 1960. Learning from examples and performance feedback.
- Seppo Linnainmaa, [“Taylor expansion of the accumulated rounding error”](https://doi.org/10.1007/BF01931367), *BIT*, 1976. Reverse calculation of the effects of local errors; its references identify the 1970 thesis.
- Paul J. Werbos, [*Beyond Regression: New Tools for Prediction and Analysis in the Behavioral Sciences*](https://gwern.net/doc/ai/nn/1974-werbos.pdf), Harvard University dissertation, 1974. Related derivative calculations.
- David E. Rumelhart, Geoffrey E. Hinton and Ronald J. Williams, [“Learning representations by back-propagating errors”](https://doi.org/10.1038/323533a0), *Nature*, 1986. Multilayer learning by backward error propagation.
- Yann LeCun and colleagues, [“Handwritten Digit Recognition with a Back-Propagation Network”](https://papers.nips.cc/paper_files/paper/1989/file/53c3bce66e43be4f209556518c2fcb54-Paper.pdf), *Advances in Neural Information Processing Systems 2*, 1989. Application to image recognition.

The desk, signal levels, target and fader settings are invented teaching examples. The feature image is AI-generated artwork of a generic studio, not a historical research site. The diagram illustrates the invented calculation.
