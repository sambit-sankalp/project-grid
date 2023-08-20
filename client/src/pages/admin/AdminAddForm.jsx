import { useDispatch, useSelector } from 'react-redux';
import {
  createAdminProduct,
  setClearErrors,
  setClearInputs,
  setCurrentId,
  setProductData,
  updateAdminProduct,
} from '../../store/admin/product/productAdminSlice';

import { ImSpinner2 } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { CartFilled } from '../costumer/cart';
import Button from '../../components/Button';
import { calculate, formatPrice } from '../../app/util';

export const AdminAddForm = () => {
  const dispatch = useDispatch();
  const {
    emptyFields,
    error,
    loadingCreate,
    loadingUpdate,
    productData,
    currentId,
  } = useSelector((store) => store.productsAdmin);
  const { cartItems, cartTotalAmount } = useSelector((store) => store.cart);

  // fetch the data that will be edited
  // will populate the form with the data
  // image OnChange
  const handleFileInputChange = (e) => {
    const { name, files } = e.target;

    if (files.length > 0 && files[0] instanceof Blob) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        dispatch(setProductData({ ...productData, [name]: reader.result }));
      };
    } else {
      dispatch(setProductData({ ...productData, [name]: '' }));
    }
  };

  // inputs OnChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProductData({ ...productData, [name]: value }));
  };

  // desc OnChange
  const handleDescriptionChange = (e, index) => {
    const { name, value } = e.target;
    const newDescription = productData.description.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: value };
      }

      return item;
    });

    dispatch(setProductData({ ...productData, description: newDescription }));
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      dispatch(updateAdminProduct({ currentId, productData })).then(
        (response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            console.log('Updated');

            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach((input) => {
              input.value = '';
            });
          }
        }
      );
    } else {
      dispatch(createAdminProduct(productData)).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          console.log('Created');

          const fileInputs = document.querySelectorAll('input[type="file"]');
          fileInputs.forEach((input) => {
            input.value = '';
          });
        }
      });
    }
  };

  // clearing input fileds
  const onClear = () => {
    dispatch(setClearInputs());
    dispatch(setClearErrors());

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = '';
    });
  };

  const onCancel = () => {
    dispatch(setClearInputs());
    dispatch(setClearErrors());
    dispatch(setCurrentId(null));

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = '';
    });
  };

  const [categories, setcategories] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products/categories')
      .then((res) => res.json())
      .then((json) => setcategories(json));
  }, []);

  return (
    <div className="col-span-2 max-h-[820px] overflow-y-auto rounded-lg border border-zinc-200 bg-[#f0e2e1] p-5 shadow-md">
      <form
        className="flex flex-col items-center gap-5 font-urbanist"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-primary md:text-3xl lg:text-4xl">
          Past Products
        </h2>

        {cartItems.map((item, i) => (
          <div key={i} className="flex justify-center border-b-2 border-black">
            <div className="grid grid-cols-5 gap-3 p-4 font-urbanist">
              {/* image */}
              <img
                src={item.image}
                alt={item.title}
                className="col-span-1 h-full w-full"
              />

              {/* name */}
              <div className="col-span-4">
                <h1 className="text-base font-bold text-primary md:text-2xl">
                  {item.title}
                </h1>

                <p className="mt-2 text-base text-primary md:text-xl">
                  {item.category}
                </p>

                <h2 className="mt-5 text-base font-bold text-primary md:text-xl">
                  {formatPrice(item.price * 80)}
                </h2>

                <p className="mt-1 flex items-center justify-start text-base text-primary md:text-lg">
                  {calculate(item.price ) ? (
                    <>
                      You will got {calculate(item.price)}{' '}
                      <img
                        src="https://res.cloudinary.com/sambitsankalp/image/upload/v1692528950/fccoin_emuzu6.png"
                        alt="BD"
                        className="ml-1 h-5 w-5"
                      />
                      from this order.
                    </>
                  ) : (
                    <></>
                  )}
                </p>
                <p className="mt-1 text-base text-primary md:text-lg">
                  The product is delivered to NIT Rourkela, Odisha, India
                </p>
              </div>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
};
