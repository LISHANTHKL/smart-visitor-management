function DashboardCards({ visitors }) {

  const total = visitors.length;

  const approved = visitors.filter(
    v => v.status === "approved"
  ).length;

  const checkedIn = visitors.filter(
    v => v.status === "checked_in"
  ).length;

  const checkedOut = visitors.filter(
    v => v.status === "checked_out"
  ).length;

  return (

    <div className="grid grid-cols-4 gap-5 mb-8">

      <div className="bg-blue-500 text-white p-5 rounded-xl shadow">

        <h2 className="text-xl font-bold">
          Total Visitors
        </h2>

        <p className="text-3xl mt-3">
          {total}
        </p>

      </div>

      <div className="bg-green-500 text-white p-5 rounded-xl shadow">

        <h2 className="text-xl font-bold">
          Approved
        </h2>

        <p className="text-3xl mt-3">
          {approved}
        </p>

      </div>

      <div className="bg-yellow-500 text-white p-5 rounded-xl shadow">

        <h2 className="text-xl font-bold">
          Checked-In
        </h2>

        <p className="text-3xl mt-3">
          {checkedIn}
        </p>

      </div>

      <div className="bg-red-500 text-white p-5 rounded-xl shadow">

        <h2 className="text-xl font-bold">
          Checked-Out
        </h2>

        <p className="text-3xl mt-3">
          {checkedOut}
        </p>

      </div>

    </div>
  );
}

export default DashboardCards;