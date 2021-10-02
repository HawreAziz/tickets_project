import mongoose from 'mongoose';


// how the model looks like after saving
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// properties passed into the model
interface TicketAttrs {
  title: string;
  price: string;
  userId: string;
}


// What propertied we have on a model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(ticketAttrs: TicketAttrs): TicketDoc
}

interface TicketDefinition {
  title: {
    type: StringConstructor,
    required: true | false;
  };
  price: {
    type: NumberConstructor,
    required: true | false
  };
  userId: {
    type: StringConstructor,
    required: true | false
  }
}


class CustomSchema extends mongoose.Schema<TicketDoc, TicketModel> {
  constructor(definition: TicketDefinition, options: mongoose.SchemaOptions) {
    super(definition, options);
  }
}

// create a schema
const ticketSchema = new CustomSchema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  });



// attach a function to schema, to create a ticket
ticketSchema.statics.build = (ticketAttrs: TicketAttrs): TicketDoc => {
  return new Ticket(ticketAttrs);
}


// create a model
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


// export the model for use
export { Ticket };
