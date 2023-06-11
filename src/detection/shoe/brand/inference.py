from utils.get_list_of_classes import handler as get_list_of_classes
from utils.get_model_no_weights import handler as get_model_no_weights
from utils.get_model_weights import handler as get_model_weights

s3_assets_bucket = 'clothes-detection-assets-bucket'
model_weights_path = 'weights/shoe_brand_model_weights.h5'

classes = get_list_of_classes('clothes-detection-shoes-bucket')
print(classes)

model = get_model_no_weights(classes)
get_model_weights(s3_assets_bucket, model_weights_path)

model.load_weights('model_weights.h5')
print('Model weights loaded')
