
import Navbar from '@components/Navbar'
const  Profile= () => {
  return (   
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Navbar/>
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="p-3 bg-gray-50 w-36">Name</td>
              <td className="p-3 w-4">:</td>
              <td className="p-3">Huba</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 bg-gray-50">CNIC</td>
              <td className="p-3">:</td>
              <td className="p-3">3510362259362</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 bg-gray-50">Phone no.</td>
              <td className="p-3">:</td>
              <td className="p-3">0325 8783249</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 bg-gray-50">Email</td>
              <td className="p-3">:</td>
              <td className="p-3">hubaijaz356@gmail.com</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 bg-gray-50">Gender</td>
              <td className="p-3">:</td>
              <td className="p-3">FEMALE</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 bg-gray-50">Religion</td>
              <td className="p-3">:</td>
              <td className="p-3">Islam</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 bg-gray-50">Address</td>
              <td className="p-3">:</td>
              <td className="p-3">cantt</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default Profile



  
  

