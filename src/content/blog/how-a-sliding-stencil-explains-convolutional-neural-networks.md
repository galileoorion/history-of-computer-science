---
title: "How a Sliding Stencil Explains Convolutional Neural Networks"
subtitle: "How small reusable filters find patterns in images, from handwritten digits to modern vision tasks"
description: "A sliding stencil and a worked 4 × 4 image explain CNN filters, feature maps, training, and uses in classification, detection, and segmentation."
sequence: 6
category: "Neural networks"
historicalPeriod: "1980–2020"
author: "Attila Kulik"
tags: ["Convolutional neural networks", "Computer vision", "Machine learning", "Image recognition"]
listingImage: "/images/cnn-sliding-stencil-feature.jpg"
listingImageAlt: "A hand moves a transparent grid over a street photograph as glowing window patterns appear in successive layers"
heroImage: "/images/cnn-sliding-stencil-feature.jpg"
heroImageAlt: "A hand moves a transparent grid over a street photograph as glowing window patterns appear in successive layers"
pubDate: 2026-10-20
draft: false
---

Imagine looking for every window in a photograph of a street. You could inspect the whole photograph at once, but you would have to remember what a window looks like at every possible position. A simpler approach is to hold up a small stencil, check one patch, slide it across, and mark where its pattern appears.

A **convolutional neural network**, or **CNN**, uses a related idea. It applies small sets of numbers to one part of an image after another. Each set looks for a pattern; later layers combine the results. The striking part is that the network learns which patterns are useful from examples. It does not need a programmer to draw every edge, corner or window in advance.

## What a CNN does

A digital image is a grid of numbers. In a greyscale image, each number represents brightness. In a colour image, each pixel usually has three values, one each for red, green and blue. A CNN keeps those values in their spatial arrangement. Nearby pixels can form a line or a corner; their order matters.

The network's basic tool is a **filter**, also called a *kernel*: a small grid of weights. Move the filter across the image. At each position, multiply each image value by the weight lying over it, then add the products. The resulting number says how strongly that patch matches the filter. Collect those numbers at every position and you have a **feature map**: a new grid showing where the pattern was found.

The same weights are used at every position. This is **weight sharing**. A filter that responds to an edge on the left can respond to the same kind of edge on the right without learning a second set of weights. A 3 × 3 filter examining a three-channel colour image has 27 weights, plus a bias, regardless of how many positions it visits. A layer usually has many filters, each producing its own feature map.

## Who developed the idea

CNNs grew out of several lines of research. In [1980, Kunihiko Fukushima described the neocognitron](https://pubmed.ncbi.nlm.nih.gov/7370364/), a layered model designed to recognise patterns even when their position changed. It learned by a different method from the backpropagation commonly used to train CNNs today.

In [1989, Yann LeCun and colleagues](https://doi.org/10.1162/neco.1989.1.4.541) used backpropagation to train a network that classified handwritten US ZIP-code digits directly from images. A [1998 paper by LeCun, Léon Bottou, Yoshua Bengio and Patrick Haffner](https://bottou.org/papers/lecun-98h) described convolutional networks for document recognition, including LeNet-5. The approach gained much wider attention when [Alex Krizhevsky, Ilya Sutskever and Geoffrey Hinton's deep CNN](https://papers.nips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf) won the 2012 ImageNet image-classification challenge. Large labelled datasets, improved training methods and graphics processors helped make that result possible.

The sliding stencil below is a way to see the calculation behind those systems. Its numbers are chosen by hand so that we can follow the arithmetic. In a trained CNN, the network adjusts the filter values itself.

## The sliding stencil

Picture a window inspector with a transparent stencil and a stack of copies of the same photograph. The inspector slides one stencil over every part of the first copy and writes a score at each position. Another stencil looks for a different pattern on the next copy. A supervisor can then look at those sheets together to decide whether the image contains a window. The comparison maps onto a CNN like this:

| On the inspector's desk | In the network |
| --- | --- |
| The photograph | The input image: an ordered grid of pixel values |
| A small stencil | A filter: a grid of weights |
| A score written at each position | One value in a feature map |
| Several marked copies | Feature maps from different filters |
| The supervisor combining marks | Later layers combining earlier features |

The inspector's stencils are already cut to shape. A CNN begins with filter weights that have not yet learned the task and adjusts them during training. That is where the analogy stops.

Suppose a tiny greyscale image contains a bright square. Here, `0` means dark and `1` means bright:

```text
Image
0 0 0 0
0 1 1 0
0 1 1 0
0 0 0 0
```

Use this 2 × 2 filter:

```text
Filter
-1  1
-1  1
```

The filter rewards brightness on its right and subtracts brightness on its left. It therefore responds to a dark-to-bright vertical boundary. Place it over the middle two rows and the first two columns of the image:

```text
Image patch       Filter
0 1              -1  1
0 1              -1  1
```

Multiply and add: `0 × -1 + 1 × 1 + 0 × -1 + 1 × 1 = 2`. That patch scores `2`. Move the filter two columns right, over the bright-to-dark boundary, and the score becomes `-2`.

Sliding one position at a time across the entire image gives this feature map:

```text
 1  0 -1
 2  0 -2
 1  0 -1
```

![A four by four image, a two by two filter, and the resulting three by three feature map, with the patch that scores two highlighted.](/images/cnn-filter-and-feature-map.svg)

*The highlighted 2 × 2 patch produces the highlighted score of 2. The same filter is applied at all nine positions.*

The left column lights up because that is where the square begins. The negative values on the right mark the opposite kind of boundary. A typical next step is an activation function such as **ReLU**, which replaces negative values with zero and leaves positive values unchanged. After ReLU, the map is:

```text
1 0 0
2 0 0
1 0 0
```

The output is 3 × 3 because a 2 × 2 filter has three horizontal and three vertical positions in a 4 × 4 image when it moves one pixel at a time without padding. Real CNNs can also add padding around an image or move a filter more than one pixel per step; those choices change the output size.

## From edges to an answer

One filter is only one question about the image. A CNN uses many filters, so one feature map might respond to a vertical boundary while another responds to a horizontal one or a texture. The next layer applies filters to those feature maps. Its input is no longer just pixels: it is a collection of earlier detections. Stacking layers lets a network combine local clues into larger patterns that are useful for its task.

Some networks reduce the width and height of feature maps as they go. **Max pooling**, for example, keeps the largest value in each small region; a convolution with a larger step can also reduce their size. This can make the later calculation smaller and can make a final prediction less sensitive to a small shift in the image. Moving an object does not, however, guarantee an unchanged prediction. At the end, a classification network turns its final features into scores for categories such as “cat” and “dog”. Other CNN designs can produce a location or a pixel-by-pixel map instead of one label.

Where did the filter values come from? During **supervised training**, the network sees images with correct answers. It makes a prediction, measures its error with a loss function, and uses backpropagation to calculate how changing each weight would affect that error. Repeated adjustments can turn initially arbitrary filters into useful detectors. The [previous post on neural networks](https://tech.attilakulik.com/how-a-starship-bridge-explains-the-neural-network/) works through that learning process in more detail.

## Where CNNs are used

The answer a CNN produces depends on how it is built and trained. Three common tasks ask increasingly specific questions about an image:

![Three CNN output types: a label for a whole image, a box locating an object, and a pixel-by-pixel mask of the object.](/images/cnn-output-types.svg)

*Different CNN designs can classify an image, locate an object, or mark the pixels belonging to it. The square is an illustrative example, not a model prediction.*

- **Image classification — “What is here?”** A model gives the whole image a category. The 2012 AlexNet system, for example, classified photographs into ImageNet categories. Its answer did not say where the object was.
- **Object detection — “What is here, and where?”** A detector gives a category and a bounding box for each object it finds. [Faster R-CNN](https://arxiv.org/abs/1506.01497) uses shared convolutional features to propose and classify regions of an image.
- **Image segmentation — “Which pixels belong to it?”** A segmentation model marks a region pixel by pixel. [U-Net](https://arxiv.org/abs/1505.04597), a CNN design introduced for biomedical image segmentation, was tested on microscopy images of cells.

These ideas extend beyond the familiar cat-or-dog photograph. The earlier handwritten-digit networks helped read [ZIP-code images](https://doi.org/10.1162/neco.1989.1.4.541), while a [deployed industrial inspection system](https://ojs.aaai.org/index.php/AAAI/article/view/7020) used a CNN to check manufactured weld nuts. Each application needs training examples and an output suited to its question: a label, a location, or a detailed mask.

## What the stencil leaves out

The hand-picked filter above has an obvious interpretation: it finds one kind of edge. Filters learned by a deep CNN are not always so easy to name, and a high score is evidence of a learned pattern, not proof that the network understands the scene as a person does. A model may also learn a shortcut in its training images, such as a background that happens to correlate with a category, then fail when that background changes. Researchers have documented this broader problem as [shortcut learning](https://www.nature.com/articles/s42256-020-00257-z).

The stencil nevertheless captures the central design choice. Rather than give every pixel a separate role, a CNN asks the same small question across an image, records where the answers appear, and builds new questions from those answers. That reuse of local patterns helped turn image recognition from a collection of hand-written rules into a system that could learn from examples.

## Sources

The historical and application claims above link to original papers or deployment reports. The square image, filter, feature-map arithmetic, and output-type graphic are constructed examples for this article; their values can be checked directly from the grids shown. The feature illustration is a visual metaphor, not a depiction of a particular CNN architecture.
