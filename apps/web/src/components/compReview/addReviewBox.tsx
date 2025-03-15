import { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Heading } from '../heading';
import { Field, Form, Formik, FormikProps } from 'formik';
import { reviewSchema } from '@/lib/reviewSchema';
import toast from 'react-hot-toast';
import { ICompReviewForm } from '@/lib/interface';
interface IConfirm {
  setIsOpen: (IsOpen: boolean) => void;
  runFunction: (values: ICompReviewForm) => void;
  companyName: string;
}

const AddReviewBox = ({ setIsOpen, runFunction, companyName }: IConfirm) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const StarRating = ({ field, form }: any) => {
    const handleRating = (rating: number) => {
      form.setFieldValue(field.name, field.value === rating ? 0 : rating);
    };

    return (
      <div className="flex space-x-1 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl ${
              star <= field.value ? 'text-yellow-500' : 'text-gray-400'
            }`}
            onClick={() => handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    setIsModalOpen(true);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const showValidationErrors = (errors: Record<string, string>) => {
    Object.values(errors).forEach((error) => {
      toast.error(error);
    });
  };
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 modal-overlay ${
        isModalOpen ? 'open' : ''
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-slate-200 p-6 rounded-lg shadow-lg w-[400px] lg:w-[800px] max-h-[80vh] overflow-y-auto modal-content ${
          isModalOpen ? 'open' : ''
        }`}
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-1 mb-2 border-b-2 border-slate-500">
          <Heading
            title="New Review"
            description={`Add your review for ${companyName}`}
          />
          <button
            onClick={closeModal}
            className="text-red-500 p-1 duration-150 ease-in-out font-bold text-xl rounded-full hover:bg-red-500 hover:text-white border border-red-500"
          >
            <XMarkIcon width={20} height={20} />
          </button>
        </div>

        {/* Confirmation Message Box */}
        <div className="mb-2">
          <Formik
            initialValues={{
              salary: 0,
              culture: 0,
              wlb: 0,
              facility: 0,
              career: 0,
              desc: '',
            }}
            validationSchema={reviewSchema}
            onSubmit={(values) => runFunction(values)}
          >
            {(props: FormikProps<ICompReviewForm>) => {
              const { validateForm, handleSubmit, isSubmitting } = props;
              return (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validateForm().then((errors) => {
                      if (Object.keys(errors).length > 0) {
                        showValidationErrors(errors);
                      } else {
                        handleSubmit();
                      }
                    });
                  }}
                >
                  <div className="flex flex-col">
                    <div className="mb-3">
                      <label>Salary Range :</label>
                      <Field
                        name="salary"
                        type="number"
                        className="formik-input"
                      />
                    </div>

                    {['culture', 'wlb', 'facility', 'career'].map((field) => (
                      <div key={field} className="mb-3">
                        <label htmlFor={field} className="block capitalize">
                          {field} Rating :
                        </label>
                        <Field name={field} component={StarRating} />
                      </div>
                    ))}
                    {/* desc */}
                    <div className="mb-3">
                      <label htmlFor="desc">Desc Rating :</label>
                      <Field
                        name="desc"
                        as="textarea"
                        className="formik-input"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end ">
                    <button
                      type="submit"
                      className="w-fit bg-yellow-200 hover:bg-yellow-400 px-4 font-semibold text-gray-800 hover:text-black py-2 rounded ease-in-out duration-150"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddReviewBox;

{
  /* salary */
}
{
  /* <div className="mb-3">
<label htmlFor="salary">Salary Rating :</label>
<Field
  name="salary"
  type="number"
  className="formik-input"
/>
</div> */
}
{
  /* culture */
}
{
  /* <div className="mb-3">
<label htmlFor="culture">Culture Rating :</label>
<Field
  name="culture"
  type="number"
  className="formik-input"
/>
</div> */
}
{
  /* wlb */
}
{
  /* <div className="mb-3">
<label htmlFor="wlb">Work Life Balance Rating :</label>
<Field
  name="wlb"
  type="number"
  className="formik-input"
/>
</div> */
}
{
  /* facility */
}
{
  /* <div className="mb-3">
<label htmlFor="facility">Facility Rating :</label>
<Field
  name="facility"
  type="number"
  className="formik-input"
/>
</div> */
}
{
  /* career */
}
{
  /* <div className="mb-3">
<label htmlFor="career">Career Rating :</label>
<Field
  name="career"
  type="number"
  className="formik-input"
/>
</div> */
}
