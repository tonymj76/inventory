/* eslint-disable camelcase */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {addProduct, getAllCategories} from 'actions';
import validate from 'react-joi-validation';
import {
  Form,
  TextArea,
  Button,
  Select,
  Segment,
} from 'semantic-ui-react';
import {ProductModel, ProductSchema} from 'models/addProduct';
import {selectorCategoryOptionList} from 'selectors/category';
import StyledComponents from 'components/styled';
// import MyDropzone from './customImage';

const {Error} = StyledComponents;

const mapStateToProps = (state) => ({
  id: state.user.user.id,
  cateList: selectorCategoryOptionList(state),
});

class AddProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  async componentDidMount() {
    await this.props.getAllCategories();
  };

  handleImages = (file) => this.setState({images: [
    ...this.state.images,
    file,
  ]});

  cloudinaryImageSetup = () => {
    cloudinary.setCloudName('dcxv3skza');
    cloudinary.createUploadWidget({
      cloudName: 'dcxv3skza',
      apiKey: '663821752958862',
      uploadPreset: 'hcj39cli',
      maxFiles: 4,
      maxImageFileSize: 1500000,
      folder: `product/${this.props.id}`,
    }, (error, result) => {
      if (!error && result && result.event === 'success') {
        this.handleImages({url: result.info.url});
      }
    }
    ).open();
  }

  handleCategoryChange(event, new_category) {
    const {changeValue} = this.props;
    changeValue('category_id', new_category.value);
  }

  handleSubmit = () => {
    const {product, addProduct, errors} = this.props;
    if (_.isEmpty(errors)) {
      addProduct(product, this.state.images);
    } else {
      this.setState({
        error: true,
      });
    }
  }

  render() {
    const {
      product: {name,
        price,
        quantity,
        weight,
        category_id,
        refound_policy,
        description,
      },
      errors,
      changeHandler,
      validateHandler,
      validateAllHandler,
      cateList,
    } = this.props;

    return (
      <div className='merchant-product'>
        <Segment>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field required>
                <label>Product name</label>
                <input
                  id='form-input-control-product-name'
                  placeholder='name'
                  name ='name'
                  value={name}
                  onChange={changeHandler('name')}
                  onBlur={validateHandler('name')}
                />
                <Error>{errors.name}</Error>
              </Form.Field>
              <Form.Field required>
                <label>
              Price
                </label>
                <input
                  id='form-input-control-price'
                  placeholder='Price'
                  name='price'
                  value={price}
                  type='number'
                  onChange={changeHandler('price')}
                  onBlur={validateHandler('price')}
                />
                <Error>{errors.price}</Error>
              </Form.Field>

              <Form.Field required>
                <label>Quantity</label>
                <input
                  id='form-input-control-quantity'
                  type='number'
                  placeholder='quantity'
                  name='quantity'
                  value={quantity}
                  onChange={changeHandler('quantity')}
                  onBlur={validateHandler('quantity')}
                />
                <Error>{errors.quantity}</Error>
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field required>
                <label>Weight</label>
                <input
                  id='form-input-control-weight'
                  placeholder='weight'
                  name='weight'
                  type='number'
                  value={weight}
                  onChange={changeHandler('weight')}
                  onBlur={validateHandler('weight')}
                />
                <Error>{errors.weight}</Error>
              </Form.Field>
              <Form.Field required>
                <label htmlFor='form-select-control-category'>Category</label>
                <Select placeholder='Default' options={cateList}
                  search
                  fluid
                  placeholder='Select Country'
                  searchInput={{id: 'form-select-control-category'}}
                  value={category_id}
                  name='category_id'
                  onChange={this.handleCategoryChange}
                  onBlur={validateHandler('category_id')}
                />
                <Error>{errors.category_id}</Error>
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field required>
                <label >Description</label>
                <TextArea
                  id='form-textarea-control-Description'
                  name='description'
                  placeholder='Description'
                  value={description}
                  onChange={changeHandler('description')}
                  onBlur={validateHandler('description')}
                />
                <Error>{errors.description}</Error>
              </Form.Field>
              <Form.Field>
                <label>Refound Policy</label>
                <TextArea
                  id='form-textarea-control-Refound'
                  placeholder='Refound Policy'
                  name='refound_policy'
                  value={refound_policy}
                  onChange={changeHandler('refound_policy')}
                  onBlur={validateHandler('refound_policy')}
                />
                <Error>{errors.refound_policy}</Error>
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field required width={6}>
                <Button
                  onClick={this.cloudinaryImageSetup}
                  className="cloudinary-button tmj white-text">
                  Upload files
                </Button>
                {/* <MyDropzone handleImages={this.handleImages}/>*/}
              </Form.Field>
            </Form.Group>
            <Form.Field
              id='form-button-control-public'
              control={Button}
              content='Confirm'
              onClick={validateAllHandler(this.handleSubmit)}
            />
          </Form>
        </Segment>
      </div>
    );
  }
}

AddProduct.defaultProps = {
  product: {
    ...ProductModel,
  },
};

const validationOptions = {
  joiSchema: ProductSchema,
  only: 'product',
  joiOptions: {
    abortEarly: false,
  },
};

export default connect(
  mapStateToProps,
  {addProduct, getAllCategories}
)(validate(AddProduct, validationOptions));
