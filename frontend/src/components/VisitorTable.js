function VisitorTable({
  visitors,
  approveVisitor,
  rejectVisitor,
}) {

  return (

    <div>

      <h2 className="text-2xl font-bold mb-5">
        Visitor Requests
      </h2>

      <table className="w-full border">

        <thead className="bg-slate-800 text-white">

          <tr>

            <th className="p-3">Visitor</th>

            <th className="p-3">Employee</th>

            <th className="p-3">Room</th>

            <th className="p-3">Date</th>

            <th className="p-3">Time</th>

            <th className="p-3">Status</th>

            <th className="p-3">Actions</th>

          </tr>

        </thead>

        <tbody>

          {visitors.map((visitor) => (

            <tr
              key={visitor._id}
              className="border-b text-center"
            >

              <td className="p-3">
                {visitor.visitor_name}
              </td>

              <td className="p-3">
                {visitor.employee_name}
              </td>

              <td className="p-3">
                {visitor.room_no}
              </td>

              <td className="p-3">
                {visitor.visit_date}
              </td>

              <td className="p-3">
                {visitor.visit_time}
              </td>

              <td className="p-3">

                <span
                  className={`px-3 py-1 rounded text-white

                  ${visitor.status === "approved"
                    ? "bg-green-500"
                    : visitor.status === "checked_in"
                    ? "bg-yellow-500"
                    : visitor.status === "checked_out"
                    ? "bg-red-500"
                    : visitor.status === "rejected"
                    ? "bg-gray-500"
                    : "bg-blue-500"
                  }
                  `}
                >

                  {visitor.status}

                </span>

              </td>

              <td className="p-3">

                <button
                  onClick={() =>
                    approveVisitor(visitor._id)
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    rejectVisitor(visitor._id)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default VisitorTable;