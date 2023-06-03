const constants = require('./constants');

const isBoundingBoxOverlapping = (instanceA, instanceB) => {
  // Calculate bounding box coordinates
  const leftA = instanceA.BoundingBox.Left;
  const topA = instanceA.BoundingBox.Top;
  const rightA = leftA + instanceA.BoundingBox.Width;
  const bottomA = topA + instanceA.BoundingBox.Height;

  const leftB = instanceB.BoundingBox.Left;
  const topB = instanceB.BoundingBox.Top;
  const rightB = leftB + instanceB.BoundingBox.Width;
  const bottomB = topB + instanceB.BoundingBox.Height;

  // Check if bounding boxes overlap
  const isOverlapping = (
    leftA <= rightB &&
    rightA >= leftB &&
    topA <= bottomB &&
    bottomA >= topB
  );

  return isOverlapping;
};

function nonOverlapingLabels (foundLabels, type) {
  const labels = foundLabels.Labels.filter(label => constants[`${type}Labels`].includes(label.Name));
  const foundInstances = labels.flatMap(label => label.Instances || []);

  let instances = [];
  let overlapsWith = -1;

  for(const foundInstance of foundInstances) {
    overlapsWith = -1;

    for(const [index, instance] of instances.entries()) {
      if(isBoundingBoxOverlapping(foundInstance, instance)) {
        overlapsWith = index
      }
    }

    if(overlapsWith === -1) {
      instances.push(foundInstance);
    } else {
      const instanceWithMostConfidence = 
        foundInstance.Confidence > instances[overlapsWith].Confidence 
        ? foundInstance : instances[overlapsWith];
      instances[overlapsWith] = instanceWithMostConfidence;
    }

  }

  return instances;
}

module.exports = {
    nonOverlapingLabels
}