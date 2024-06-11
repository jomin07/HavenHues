import { ClipLoader } from "react-spinners";

type Props = {
    loading: boolean
}
const Loader = ({ loading }: Props) =>{
        return(
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        );
    
}

export default Loader;